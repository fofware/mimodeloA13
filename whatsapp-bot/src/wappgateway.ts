/**
 * https://cincodias.elpais.com/cincodias/2021/02/10/lifestyle/1612984834_968318.html
 * https://culturacolectiva.com/tecnologia/whatsapp-como-anadir-contactos-con-codigo-qr/
 */
import { Buttons, Client, LegacySessionAuth, List, LocalAuth, Location } from 'whatsapp-web.js';
import whatsapp from './models/whatsapp';
import wappphone  from './models/phones';
import { Router } from 'express';
import app from './app';
export interface phoneGateway {
  cuenta: string;
  number: string;
  name: string;
  client?: any;
  socket?: any;
}

export const gateways = {}

export const initAllWapp = async (app) =>{
  console.log('conectando gateway')
  const array = await wappphone.find();
  //console.log(array);
  const io = app.get('sio');
  const router: Router = Router();
  for (let index = 0; index < array.length; index++) {
    const p:any = array[index];
    gateways[p.number] = {
      client: await storedGateway(p),
    }
    if ( typeof(gateways[p.number].client) !== 'string') 
      setRoutes( router, p.number)
    const chats = await gateways[p.number].client.getChats();
    //const messages = await gateways[p.number].client.searchMessages();
    for (let i = 0; i < chats.length; i++) {
      const e = chats[i];
      e['messages'] = await e.fetchMessages({limit: 3000});
      e['contacto'] = await e.getContact();
      e['picUrl'] = await e['contacto'].getProfilePicUrl();
    }
    io.to(p.rooms).emit('chats',chats);
    const contactos = await gateways[p.number].client.getContacts()
    //for (let i = 0; i < contactos.length; i++) {
    //  const c = contactos[i];
    //  //c['chat'] = await c.getChat();
    //  //c['chat']['messages'] = await c['chat'].fetchMessages({limit: 2000})
    //  //c['picUrl'] = await c.getProfilePicUrl();
    //  //c['about'] = await c.getAbout();
    //}
    io.to(p.rooms).emit('contactos',contactos);
    console.log(gateways)
  }
  app.use(router)
}
let io;
export const storedGateway = async ( p:any ) => {
  return new Promise(async (resolve, reject) => {
    //console.log(p);
    io = app.get('sio')
    const sockets = await io.fetchSockets();
    for( const skt of sockets){
      //skt.join('firulais-owner')
      console.log(skt.data.rooms)
      console.log(skt.id);
      console.log(skt.rooms)
      console.log(skt.data.email)
    }
    const client = new Client({
      authStrategy: new LocalAuth(
        {
          dataPath: './sessions/',
          clientId: `${p.cuenta}_${p.number}`
        }
      ),
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });
    client.initialize();

    client.on('auth_failure', err =>  {
      io.to(p.rooms).emit('auth_failure',err)
      //console.log(`${client.info.pushname} ${client.info.wid.user} Authentication Error`);
      console.error(err);
      reject(err)
    });

    client.on('authenticated', async (session) => {
      console.log(`Authenticated`);
    });

    client.on('change_battery', (batteryInfo) => {
      io.to(p.rooms).emit('change_battery',batteryInfo)
      console.log(`${client.info.pushname} ${client.info.wid.user} BatteryInfo ${batteryInfo}`);
    });

    client.on('change_state', (state) => {
      io.to(p.rooms).emit('change_state',state)
      console.log(`${client.info.pushname} ${client.info.wid.user} cambio de estado ${state}`);
    });

    client.on('disconnected', (state) => {
      io.to(p.rooms).emit('disconnected',state)
      console.log(`${client.info.pushname} ${client.info.wid.user} disconnected ${state}`);
    });

    client.on('group_join', (value) => {
      io.to(p.rooms).emit('group_join',value)
      console.log(`${client.info.pushname} ${client.info.wid.user} group_join ${value}`);
    });

    client.on('group_leave', (value) => {
      io.to(p.rooms).emit('group_leave',value)
      console.log(`${client.info.pushname} ${client.info.wid.user} group_leave ${value}`);
    });

    client.on('incoming_call', (value) => {
      io.to(p.rooms).emit('incoming_call',value)
      console.log(`${client.info.pushname} ${client.info.wid.user} incoming_call ${value}`);
    });

    client.on('media_uploaded', (value) => {
      io.to(p.rooms).emit('media_uploaded',value)
      console.log(`${client.info.pushname} ${client.info.wid.user} media_uploaded ${value}`);
    });

    client.on('message', async msg => {
      //gateways[client.info.wid.user].sockets.forEach( stk => stk.emit('message',msg))
      io.to(p.rooms).emit('message',msg)
      const ret = await whatsapp.insertMany([msg])
      console.log(`${client.info.pushname} ${client.info.wid.user} MESSAGE RECEIVED`,msg);
      procesaMsg(client,msg)
    })

    client.on('message_ack', async (msg, ack) => {
      //gateways[client.info.wid.user].sockets.forEach( stk => stk.emit('message_ack',{msg,ack}))
      io.to(p.rooms).emit('message_ack',{msg,ack})
      const ret = await whatsapp.insertMany([msg])
      const ackTxt = ['','se envio','recibió','leyó','Dio play al audio']
      console.log(`${client.info.pushname} ${client.info.wid.user} message_ack ${ack} ${msg.to} ${ackTxt[ack]}`);
    })

    client.on('message_create', async (message) => {
      io.to(p.rooms).emit('message_create',message)
      const ret = await whatsapp.insertMany([message])
      console.log(`${client.info.pushname} ${client.info.wid.user} message_create`,message.id);
    });

    client.on('message_revoke_everyone', (message, revoked_msg) => {
      //gateways[client.info.wid.user].sockets.forEach( stk => stk.emit('message_revoke_everyone',{message,revoked_msg}))
      io.to(p.rooms).emit('message_revoke_everyone',{message,revoked_msg})
      console.log(`${client.info.pushname} ${client.info.wid.user} message_revoke_everyone`,message);
    })

    client.on('qr', async qr => {
      const numero = p.number;
      //const picUrl = await client.getProfilePicUrl(`${numero}@c.us`)
      io.to(p.rooms).emit('qr',{qr,numero})
      console.log(`${client.info.pushname} ${client.info.wid.user} qr=>`,qr);
      console.log("qr",qr);
      //reject('Error necesita leer el qr')
    })

    client.on('ready', async (ready) => {
      //gateways[client.info.wid.user].sockets.forEach( stk => stk.emit('ready',`${client.info.pushname} ${client.info.wid.user} conected & ready`))
      io.to(p.rooms).emit('ready',`${client.info.pushname} ${client.info.wid.user} conected & ready`)
      console.log(`${client.info.pushname} ${client.info.wid.user} conected & ready`);
      resolve(client)
    })
  })
}

export const newGateway = async ( skt ) => {
  return new Promise((resolve, reject) => {
    
    const client = new Client({
      authStrategy: new LocalAuth(
        {
          dataPath: './sessions/',
          clientId: `${skt.data.cuenta}_${skt.data.number}`
        }
      ),
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });

    client.initialize();

    client.on('auth_failure', err =>  {
      skt.to(skt.data.rooms).emit('auth_failure',err)
      console.error(err);
      reject(err)
    });

    client.on('authenticated', async (session) => {
      skt.to(skt.data.rooms).emit('authenticated','Authenticated')
      console.log(`Authenticated`);
    });

    client.on('change_battery', (batteryInfo) => {
      skt.to(skt.data.rooms).emit('change_battery',batteryInfo)
      console.log(`${client.info.pushname} ${client.info.wid.user} BatteryInfo ${batteryInfo}`);
    });

    client.on('change_state', (state) => {
      skt.to(skt.data.rooms).emit('change_state',state)
      console.log(`${client.info.pushname} ${client.info.wid.user} cambio de estado ${state}`);
    });

    client.on('disconnected', (state) => {
      skt.to(skt.data.rooms).emit('disconnected',state);
      console.log(`${client.info.pushname} ${client.info.wid.user} disconnected ${state}`);
    });

    client.on('group_join', (value) => {
      skt.to(skt.data.rooms).emit('group_join',value)
      console.log(`${client.info.pushname} ${client.info.wid.user} group_join ${value}`);
    });

    client.on('group_leave', (value) => {
      skt.to(skt.data.rooms).emit('group_leave',value)
      console.log(`${client.info.pushname} ${client.info.wid.user} group_leave ${value}`);
    });

    client.on('incoming_call', (value) => {
      skt.to(skt.data.rooms).emit('incoming_call',value);
      console.log(`${client.info.pushname} ${client.info.wid.user} incoming_call ${value}`);
    });

    client.on('media_uploaded', (value) => {
      skt.to(skt.data.rooms).emit('media_uploaded',value);
      console.log(`${client.info.pushname} ${client.info.wid.user} media_uploaded ${value}`);
    });

    client.on('message', async msg => {
      io.to(skt.data.rooms).emit('message',msg);
      const ret = await whatsapp.insertMany([msg])
      console.log(`${client.info.pushname} ${client.info.wid.user} MESSAGE RECEIVED`,msg);
      procesaMsg(client,msg)
    })

    client.on('message_ack', async (msg, ack) => {
      skt.to(skt.data.rooms).emit('message_ack',{msg,ack});
      const ret = await whatsapp.insertMany([msg])
      const ackTxt = ['','se envio','recibió','leyó']
      console.log(`${client.info.pushname} ${client.info.wid.user} message_ack ${ack} ${msg.to} ${ackTxt[ack]}`);
    })

    client.on('message_create', async (message) => {
      skt.to(skt.data.rooms).emit('message_create',message);
      const ret = await whatsapp.insertMany([message])
    });

    client.on('message_revoke_everyone', (message, revoked_msg) => {
      skt.to(skt.data.rooms).emit('message_revoke_everyone',{message,revoked_msg});
    })

    client.on('qr', async qr => {
      const numero = skt.data.number;
      skt.to(skt.data.rooms).emit('qr',{qr,numero})
    })

    client.on('ready', async (ready) => {
      skt.to(skt.data.rooms).emit('ready',`${client.info.pushname} ${client.info.wid.user} conected & ready`)
			const rpta = await wappphone.updateOne({ number: skt.data.number },   // Query parameter
				{ $set: skt.data }, 
				{ upsert: true }    // Options
			);

      resolve(client)
    })
  })
}

const setRoutes = (router, number) => {
  /**
   * Routes
   */
  const client = gateways[number].client
  router.get(`/${number}/blockedcontactos`, async (req, res) =>{
    const contacts = await client.getBlockedContacts();
    res.status(200).json(contacts);
  })

  router.get(`/${number}/blockedcontactos`, async (req, res) =>{
    const contacts = await client.getBlockedContacts();
    res.status(200).json(contacts);
  })

  router.get(`/${number}/chats`, async (req, res) =>{
    const contacts = await client.getChats();
    res.status(200).json(contacts);
  })

  router.get(`/${number}/chat/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await client.getChatById(serialized);
    res.status(200).json(value);
  })

  router.get(`/${number}/chat/:serialized/labels`, async (req, res) =>{
    const {serialized} = req.params
    const value = await client.getChatLabels(serialized);
    res.status(200).json(value);
  })

  router.get(`/${number}/chatsbylabel/:id`, async (req, res) =>{
    const {id} = req.params
    const value = await client.getChatLabels(id);
    res.status(200).json(value);
  })

  router.get(`/${number}/commongroups/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await client.getCommonGroups(serialized);
    res.status(200).json(value);
  })
  
  router.get(`/${number}/contactos`, async (req, res) =>{
    const contacts = await client.getContacts()
    res.status(200).json(contacts);
  });

  router.get(`/${number}/contact/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await client.getContactById(serialized);
    res.status(200).json(value);
  })

  router.get(`/${number}/countrycode/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await client.getCountryCode(number);
    res.status(200).json(value);
  })

  router.get(`/${number}/formattednumber/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await client.getFormattedNumber(number);
    res.status(200).json(value);
  })

  router.get(`/${number}/invitedinfo/:code`, async (req, res) =>{
    const {code} = req.params
    const value = await client.getInviteInfo(code);
    res.status(200).json(value);
  })

  router.get(`/${number}/labels`, async (req, res) =>{
    const value = await client.getLabels();
    res.status(200).json(value);
  })

  router.get(`/${number}/numberid/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await client.getNumberId(number);
    res.status(200).json(value);
  })

  router.get(`/${number}/profilepicurl/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await client.getProfilePicUrl(serialized);
    res.status(200).json(value);
  })

  router.get(`/${number}/state`, async (req, res) =>{
    const value = await client.getState();
    res.status(200).json(value);
  })

  router.get(`/${number}/wwebversion`, async (req, res) =>{
    const value = await client.getWWebVersion();
    res.status(200).json(value);
  })
  
  // No usar esto no entiendo que hace pero debo rearrancar el programa para que vuelva a funcionar
  //router.get(`/${p.number}/initialize`, async (req, res) =>{
  //  const value = await p.client.initialize();
  //  res.status(200).json(`${p.number} fue inicializado`);
  //})

  router.get(`/${number}/isregistereduser/:id`, async (req, res) =>{
    const { id } = req.params;
    const value = await client.isRegisteredUser(`${id}@c.us`);
    res.status(200).json(value);
  })
  
  router.get(`/${number}/logout`, async (req, res) =>{
    const value = await client.logout();
    res.status(200).json(`${number} fue deslogueado`);
  })
  // No está probada
  router.get(`/${number}/markchatunread/:id`, async (req, res) =>{
    const { id } = req.params;
    const value = await client.markChatUnread(id);
    res.status(200).json(value);
  })

  // No está probada
  router.get(`/${number}/mutechat/:chatid/:unmutedate`, async (req, res) =>{
    const { chatid, unmutedate } = req.params;
    const value = await client.muteChat(chatid,unmutedate);
    res.status(200).json(value);
  })
  
  // No está probada
  router.get(`/${number}/pinchat`, async (req, res) =>{
    const value = await client.pinChat();
    res.status(200).json(value);
  })
  // No usar esto no entiendo que hace pero debo rearrancar el programa para que vuelva a funcionar
  //router.get(`/${p.number}/resetstate`, async (req, res) =>{
  //  const value = await p.client.resetState();
  //  res.status(200).json(value);
  //})
  
  // No está probada
  router.post(`/${number}/searchmessages`, async (req, res) =>{
    const { query, options } = req.body;
    const value = await client.searchMessages(query,options);
    res.status(200).json(value);
  })

  // No está probada
  router.post(`/${number}/sendmessage`, async (req, res) =>{
    const { chatId, content, options } = req.query;
    const value = await client.sendMessage(chatId, content, options);
    res.status(200).json(value);
  })
  
  router.get(`/${number}/available`, async (req, res) =>{
    const value = await client.sendPresenceAvailable();
    res.status(200).json('sendPresenceAvailable');
  })

  router.get(`/${number}/unavailable`, async (req, res) =>{
    const value = await client.sendPresenceUnavailable();
    res.status(200).json('sendPresenceUnavailable');
  })
}


const procesaMsg = async (client, msg) => {
  if (msg.body === '!ping reply') {
      // Send a new message as a reply to the current one
      msg.reply('pong');

  } else if (msg.body === '!ping') {
      // Send a new message to the same chat
      client.sendMessage(msg.from, 'pong');

  } else if (msg.body.startsWith('!sendto ')) {
      // Direct send a new message to specific id
      let number = msg.body.split(' ')[1];
      let messageIndex = msg.body.indexOf(number) + number.length;
      let message = msg.body.slice(messageIndex, msg.body.length);
      number = number.includes('@c.us') ? number : `${number}@c.us`;
      let chat = await msg.getChat();
      chat.sendSeen();
      client.sendMessage(number, message);

  } else if (msg.body.startsWith('!subject ')) {
      // Change the group subject
      let chat = await msg.getChat();
      if (chat.isGroup) {
          let newSubject = msg.body.slice(9);
          chat.setSubject(newSubject);
      } else {
          msg.reply('This command can only be used in a group!');
      }
  } else if (msg.body.startsWith('!echo ')) {
      // Replies with the same message
      msg.reply(msg.body.slice(6));
  } else if (msg.body.startsWith('!desc ')) {
      // Change the group description
      let chat = await msg.getChat();
      if (chat.isGroup) {
          let newDescription = msg.body.slice(6);
          chat.setDescription(newDescription);
      } else {
          msg.reply('This command can only be used in a group!');
      }
  } else if (msg.body === '!leave') {
      // Leave the group
      let chat = await msg.getChat();
      if (chat.isGroup) {
          chat.leave();
      } else {
          msg.reply('This command can only be used in a group!');
      }
  } else if (msg.body.startsWith('!join ')) {
      const inviteCode = msg.body.split(' ')[1];
      try {
          await client.acceptInvite(inviteCode);
          msg.reply('Joined the group!');
      } catch (e) {
          msg.reply('That invite code seems to be invalid.');
      }
  } else if (msg.body === '!groupinfo') {
      let chat = await msg.getChat();
      if (chat.isGroup) {
          msg.reply(`
              *Group Details*
              Name: ${chat.name}
              Description: ${chat.description}
              Created At: ${chat.createdAt.toString()}
              Created By: ${chat.owner.user}
              Participant count: ${chat.participants.length}
          `);
      } else {
          msg.reply('This command can only be used in a group!');
      }
  } else if (msg.body === '!chats') {
      const chats = await client.getChats();
      client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
      for (let i = 0; i < chats.length; i++) {
        const element = chats[i];
        console.log(chats);
        client.sendMessage(msg.from, element.name);
      }
  } else if (msg.body === '!info') {
      let info = client.info;
      client.sendMessage(msg.from, `
          *Connection info*
          User name: ${info.pushname}
          My number: ${info.wid.user}
          Platform: ${info.platform}
      `);
  } else if (msg.body === '!mediainfo' && msg.hasMedia) {
      const attachmentData = await msg.downloadMedia();
      msg.reply(`
          *Media info*
          MimeType: ${attachmentData.mimetype}
          Filename: ${attachmentData.filename}
          Data (length): ${attachmentData.data.length}
      `);
  } else if (msg.body === '!quoteinfo' && msg.hasQuotedMsg) {
      const quotedMsg = await msg.getQuotedMessage();
      quotedMsg.reply(`
          ID: ${quotedMsg.id._serialized}
          Type: ${quotedMsg.type}
          Author: ${quotedMsg.author || quotedMsg.from}
          Timestamp: ${quotedMsg.timestamp}
          Has Media? ${quotedMsg.hasMedia}
      `);
  } else if (msg.body === '!resendmedia' && msg.hasQuotedMsg) {
      const quotedMsg = await msg.getQuotedMessage();
      if (quotedMsg.hasMedia) {
          const attachmentData = await quotedMsg.downloadMedia();
          client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
      }
  } else if (msg.body === '!location') {
      msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
  } else if (msg.location) {
      msg.reply(msg.location);
  } else if (msg.body.startsWith('!status ')) {
      const newStatus = msg.body.split(' ')[1];
      await client.setStatus(newStatus);
      msg.reply(`Status was updated to *${newStatus}*`);
  } else if (msg.body === '!mention') {
      const contact = await msg.getContact();
      const chat = await msg.getChat();
      chat.sendMessage(`Hi @${contact.number}!`, {
          mentions: [contact]
      });
  } else if (msg.body === '!delete') {
      if (msg.hasQuotedMsg) {
          const quotedMsg = await msg.getQuotedMessage();
          if (quotedMsg.fromMe) {
              quotedMsg.delete(true);
          } else {
              msg.reply('I can only delete my own messages');
          }
      }
  } else if (msg.body === '!pin') {
      const chat = await msg.getChat();
      await chat.pin();
  } else if (msg.body === '!archive') {
      const chat = await msg.getChat();
      await chat.archive();
  } else if (msg.body === '!mute') {
      const chat = await msg.getChat();
      // mute the chat for 20 seconds
      const unmuteDate = new Date();
      unmuteDate.setSeconds(unmuteDate.getSeconds() + 20);
      await chat.mute(unmuteDate);
  } else if (msg.body === '!typing') {
      const chat = await msg.getChat();
      // simulates typing in the chat
      chat.sendStateTyping();
  } else if (msg.body === '!recording') {
      const chat = await msg.getChat();
      // simulates recording audio in the chat
      chat.sendStateRecording();
  } else if (msg.body === '!clearstate') {
      const chat = await msg.getChat();
      // stops typing or recording in the chat
      chat.clearState();
  } else if (msg.body === '!jumpto') {
      if (msg.hasQuotedMsg) {
          const quotedMsg = await msg.getQuotedMessage();
          client.interface.openChatWindowAt(quotedMsg.id._serialized);
      }
  } else if (msg.body === '!buttons') {
      let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
      client.sendMessage(msg.from, button);
  } else if (msg.body === '!list') {
      let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
      let list = new List('List body','btnText',sections,'Title','footer');
      client.sendMessage(msg.from, list);
  } else if (msg.body === '!reaction') {
      msg.react('👍');
  }
}
