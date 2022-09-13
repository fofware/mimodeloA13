
import { Buttons, Client, List, LocalAuth, Location, Message } from 'whatsapp-web.js';
import whatsapp from './models/whatsapp';
import wappphone  from './models/phones';
import { Router } from 'express';
import app from './app';
import { Socket } from 'socket.io';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const gateways = {}

export const initAllWapp = async (app) =>{

  const array = await wappphone.find({activo: true});
  const io = app.get('sio');
  const router: Router = Router();
  const totalini = new Date();
  const asyncFunctions = []
  for (let index = 0; index < array.length; index++) {
    const p:any = array[index];
    asyncFunctions.push(storedGateway(p))
  }
  const results:Client[] = await Promise.all(asyncFunctions)
  //results.map( client => { setRoutes(router,client) })
  //for (let i = 0; i < results.length; i++) {
  //  const c = results[i];
  //  //console.log(c.info)
  //}
  const totalend = new Date();
  const totaldif = totalend.getTime()-totalini.getTime();
  console.log(totaldif)
  app.use(router)
}
let io;
export const storedGateway = async ( p:any ): Promise <Client> => {
  return new Promise(async (resolve, reject) => {
    io = app.get('sio')
    let id = p.user
    let qrSend = 0;
    const retries = 10;

    const client = new Client({
      authStrategy: new LocalAuth(
        {
          dataPath: './sessions/',
          clientId: p.sessionId,
        },
      ),
      qrMaxRetries: retries,
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });
    client.initialize();
    client['user'] = p.user;
    client['retriessend'] = 0
    client.on('auth_failure', err =>  {
      io.to(p.rooms).emit('auth_failure',err)
      console.error(err);
      reject(err)
    });

    client.on('authenticated', async (session) => {
      console.log(`Authenticated`);
    });

    client.on('change_battery', (batteryInfo) => {
      io.to(p.rooms).emit('change_battery',{phone: client.info.wid.user, batteryInfo})
      console.log(`${client.info.pushname} ${client.info.wid.user} BatteryInfo ${batteryInfo}`);
    });

    client.on('change_state', (state) => {
      io.to(p.rooms).emit('change_state',{phone: client.info.wid.user, state})
      console.log(`${client.info.pushname} ${client.info.wid.user} cambio de estado ${state}`);
    });

    client.on('disconnected', async (state) => {
      console.log(client)
      io.to(p.rooms).emit('change_state',{phone: client.info.wid.user, state})
      io.to(p.rooms).emit('disconnected',`${client.info.pushname} ${client.info.wid.user} disconnected ${state}`)
      const borrar = `${client['user']}_${client.info.wid.user}`
      fs.rmSync(`./sessions/session-${borrar}`, { recursive: true, force: true });
      await wappphone.findOneAndUpdate({user: client['user'], phone: client.info.wid.user}, {activo: false})
      console.log('---------------------------------')
      console.log(`${client.info.pushname} ${client.info.wid.user} Desconecto`);
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
      msg['on'] = `message ${client.info.wid.user}`;
      msg['serialized'] = msg.id._serialized; 
      io.to(p.rooms).emit('message',msg)

      const ret = await saveMsg(msg)

      console.log('---------------------------------')
      console.log(`${client.info.pushname} ${client.info.wid.user} MESSAGE RECEIVED`);
      showTime(msg);
      procesaMsg(client,msg)
    })

    client.on('message_ack', async (msg, ack) => {

      msg['on'] = `message_ack ${client.info.wid.user}`;
      msg['serialized'] = msg.id._serialized; 
      io.to(p.rooms).emit('message_ack',{msg,ack})

      const ret = await saveMsg(msg)

      const ackTxt = ['','se envio','recibió','leyó','Dio play al audio']
      console.log('---------------------------------')
      console.log(`${client.info.pushname} ${client.info.wid.user} message_ack ${ack} ${msg.to} ${ackTxt[ack]}`);
      showTime(msg);
    })

    client.on('message_create', async (msg) => {

      msg['on'] = `message_create ${client.info.wid.user}`;
      msg['serialized'] = msg.id._serialized; 
      io.to(p.rooms).emit('message_create',msg)

      const ret = await saveMsg(msg)

      console.log('---------------------------------')
      console.log(`${client.info.pushname} ${client.info.wid.user} message_create`);
      showTime(msg);
    });

    client.on('message_revoke_everyone', async (msg, revoked_msg) => {
      //gateways[client.info.wid.user].sockets.forEach( stk => stk.emit('message_revoke_everyone',{message,revoked_msg}))
      msg['on'] = 'message_revoke_everyone';
      msg['serialized'] = msg.id._serialized; 
      msg['revoked_msg'] = revoked_msg;

      const ret = await saveMsg(msg)

      io.to(p.rooms).emit('message_revoke_everyone',{msg,revoked_msg})
      console.log('---------------------------------')
      console.log(`${client.info.pushname} ${client.info.wid.user} message_revoke_everyone`);
      showTime(msg);
    })

    client.on('qr', async qr => {
      //const picUrl = await client.getProfilePicUrl(`${numero}@c.us`)
      qrSend++;
      const qrMaxRetries = client['options']?.qrMaxRetries
      console.log(qrMaxRetries);
      io.to(p.rooms).emit('qr',{qr, qrSend, qrMaxRetries, numero: client['toPhone']})
//      console.log(`${client.info.pushname} ${client.info.wid.user} qr=>`,qr);
      console.log("qr",qr);
      resolve(client)
      //reject('Error necesita leer el qr')
    })

    client.on('ready', async (ready) => {
      io.to(p.rooms).emit('ready',`${client.info.pushname} ${client.info.wid.user} conected & ready`)
      console.log(`${client.info.pushname} ${client.info.wid.user} connected & ready ${ready}`);

      //const chats = await client.getChats();
      ////const messages = await gateways[p.number].client.searchMessages();
      //const tosave = [];
      //for (let i = 0; i < chats.length; i++) {
      //  const e = chats[i];
      //  e['messages'] = await e.fetchMessages( {'limit': 15000 } );
      //  e['messages'].map( async (m:any) =>{
      //    tosave.push( saveMsg(m) );
      //  })
      //  //e['contacto'] = await e.getContact();
      //  //e['picUrl'] = await e['contacto'].getProfilePicUrl();
      //}
      //Promise.all(tosave).then( (data) => {
      //  console.timeLog('gabró los mensajes')
      //})
  
      setRoutes(client);
      resolve(client)
    })
  })
}

export const saveMsg = async (m) => {

  m['myid'] = m.id.id;
  m['fromMe'] = m.id.fromMe;
  try {
    let ret = await whatsapp.findOneAndUpdate(
      { myId: m.myId, fromMe: m.fromMe, timestamp: m.timestamp, from: m.from, to: m.to}, 
      m, 
      {

        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
      }
    );
    ret.value instanceof whatsapp; // true
    // The below property will be `false` if MongoDB upserted a new
    // document, and `true` if MongoDB updated an existing object.
    ret.lastErrorObject.updatedExisting; // false
    return ret;
  } catch (error) {
    console.log(error)
  }

}


const showTime = (msg) => {
  console.log(`(${msg.id._serialized})`)
  console.log(`${msg.id.id} (${msg.ack}) - ${msg.orderId}`);
  const tn = new Date();
  const at = tn.toISOString()
  const am = tn.getTime();
  const t = new Date();
  t.setTime(msg.timestamp*1000);
  const ts = t.toISOString();
  console.log(msg.timestamp, am, ts, at);
}

export const newGateway = async ( skt:Socket ): Promise< Client | null > => {
  return new Promise((resolve, reject) => {
    console.log('newGateway')
    skt.emit('menssage', 'newGateWay')
    skt.data.sessionId = uuidv4();
    const retries = 10;
    let qrSend = 0

    const client:Client = new Client({
      authStrategy: new LocalAuth(
        {
          dataPath: './sessions/',
          clientId: skt.data.sessionId,
        },
      ),
      qrMaxRetries: retries,
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });

    skt.emit('menssage', 'newGateWay initialize')
    client.initialize();

    client.on('auth_failure', err =>  {
      skt.emit('auth_failure',err)
      console.error(err);
      reject(err)
    });

    client.on('authenticated', async (session) => {
      skt.emit('authenticated','Authenticated')
      console.log(`Authenticated`);

    });

    client.on('qr', async qr => {
      const qrMaxRetries = client['options']?.qrMaxRetries
      qrSend++;
      console.log(qr, qrSend, qrMaxRetries)
      skt.emit('qr',{qr, qrSend, qrMaxRetries})
      if (qrSend > qrMaxRetries){
        skt.emit('error', "QR no escaneado")
        client.destroy();
        resolve (null)
      } 
    })

    client.on('ready', async (ready) => {

      skt.to(skt.data.rooms).emit('ready',`${client.info.pushname} ${client.info.wid.user} conected & ready`)
			/*
      const rpta = await wappphone.updateOne({ number: skt.data.phone },   // Query parameter
				{ $set: skt.data }, 
				{ upsert: true }    // Options
			);
      */
      resolve(client)
    })
  })
}

const setRoutes = (client:Client) => {
  /**
   * Routes
   */
  const router: Router = Router();
  const num  = client.info.wid.user || client.info.me.user;
  router.get(`/${num}/blockedcontactos`, async (req, res) =>{
    const contacts = await client.getBlockedContacts();
    res.status(200).json(contacts);
  })

  router.get(`/${num}/blockedcontactos`, async (req, res) =>{
    const contacts = await client.getBlockedContacts();
    res.status(200).json(contacts);
  })

  router.get(`/${num}/chats`, async (req, res) =>{
    const limit = 10;
    const chats = await client.getChats();
    const tosave = [];
    //for (let i = 0; i < chats.length; i++) {
    //  const e = chats[i];
    //  e['messages'] = await e.fetchMessages( {limit} );
    //  //e['contacto'] = await e.getContact();
    //  //e['picUrl'] = await e['contacto'].getProfilePicUrl();
    //}
    res.status(200).json(chats);
  });

  router.get(`/${num}/chats/:limit`, async (req, res) =>{
    const {limit} = req.params
    const myLimit = parseInt(limit)
    const ini = new Date().getTime()
    const chats = await client.getChats();

    const tosave = [];
    const leermsgs = [];
    for (let i = 0; i < chats.length; i++) {
      const e = chats[i];
      leermsgs.push(e.fetchMessages( {'limit': myLimit} ))
      //e['messages'] = await e.fetchMessages( {'limit': myLimit} );
      //e['messages'].map( async (m:any) =>{
      //  tosave.push( saveMsg(m) );
      //})
      //e['contacto'] = await e.getContact();
      //e['picUrl'] = await e['contacto'].getProfilePicUrl();
    }

    const rsleer = await Promise.all(leermsgs);
    const tmsgs = new Date().getTime() - ini;
    console.log("leyo los msg", tmsgs)
    let cuenta = 0;
    rsleer.map(msgs => {
      msgs.map( msg  => {
        tosave.push(saveMsg(msg));
      });
    });
    
    const results = await Promise.all(tosave)
    const stime = new Date().getTime() - ini
    const ret = {
      modifiedCount: 0,
      upsertedCount: 0,
      total: results.length,
      chats: chats.length,
      msgs: tosave.length,
      tmsgs,
      stime
    }
    
    results.map(r => {
      if(r.lastErrorObject.updatedExisting) ret.modifiedCount++;
      else ret.upsertedCount++
    } )
    
    //console.log(results);
    res.status(200).json(ret);
  })

  router.get(`/${num}/chat/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await client.getChatById(serialized);
    res.status(200).json(value);
  })

  router.get(`/${num}/chat/:serialized/labels`, async (req, res) =>{
    const {serialized} = req.params
    const value = await client.getChatLabels(serialized);
    res.status(200).json(value);
  })

  router.get(`/${num}/chatsbylabel/:id`, async (req, res) =>{
    const {id} = req.params
    const value = await client.getChatLabels(id);
    res.status(200).json(value);
  })

  router.get(`/${num}/commongroups/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await client.getCommonGroups(serialized);
    res.status(200).json(value);
  })
  
  router.get(`/${num}/contacts`, async (req, res) =>{
    const contacts = await client.getContacts()
    const datArray = []
    contacts.map( async c => {
      datArray.push(c.getAbout())
      datArray.push(c.getChat())
      datArray.push(c.getProfilePicUrl())
      datArray.push(c.getFormattedNumber())
      datArray.push(c.getCommonGroups())
    })
    const results = await Promise.all(datArray)
    let i = 0;
    contacts.map(c => {
      c['about'] = results[0+i];
      c['chat'] = results[1+i];
      c['picUrl'] = results[2+i];
      c['fNumber'] = results[3+i];
      c['cGroups'] = results[4+i];
      i+=5;
    })
    res.status(200).json(contacts);
  });

  router.get(`/${num}/contact/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await client.getContactById(serialized);
    res.status(200).json(value);
  })

  router.get(`/${num}/countrycode/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await client.getCountryCode(number);
    res.status(200).json(value);
  })

  router.get(`/${num}/formattednumber/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await client.getFormattedNumber(number);
    res.status(200).json(value);
  })

  router.get(`/${num}/invitedinfo/:code`, async (req, res) =>{
    const {code} = req.params
    const value = await client.getInviteInfo(code);
    res.status(200).json(value);
  })

  router.get(`/${num}/labels`, async (req, res) =>{
    const value = await client.getLabels();
    res.status(200).json(value);
  })

  router.get(`/${num}/numberid/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await client.getNumberId(number);
    res.status(200).json(value);
  })

  router.get(`/${num}/profilepicurl/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await client.getProfilePicUrl(serialized);
    res.status(200).json(value);
  })

  router.get(`/${num}/state`, async (req, res) =>{
    const value = await client.getState();
    res.status(200).json(value);
  })

  router.get(`/${num}/wwebversion`, async (req, res) =>{
    const value = await client.getWWebVersion();
    res.status(200).json(value);
  })
  
  // No usar esto no entiendo que hace pero debo rearrancar el programa para que vuelva a funcionar
  //router.get(`/${p.number}/initialize`, async (req, res) =>{
  //  const value = await p.client.initialize();
  //  res.status(200).json(`${p.number} fue inicializado`);
  //})

  router.get(`/${num}/isregistereduser/:id`, async (req, res) =>{
    const { id } = req.params;
    const value = await client.isRegisteredUser(`${id}@c.us`);
    res.status(200).json(value);
  })
  
  router.get(`/${num}/logout`, async (req, res) =>{
    const value = await client.logout();
    res.status(200).json(`${num} fue deslogueado`);
  })
  // No está probada
  router.get(`/${num}/markchatunread/:id`, async (req, res) =>{
    const { id } = req.params;
    const value = await client.markChatUnread(id);
    res.status(200).json(value);
  })

  // No está probada
  /*
  router.get(`/${num}/mutechat/:chatid/:unmutedate`, async (req, res) =>{
    const { chatid, unmutedate } = req.params;
    const value = await client.muteChat(chatid,unmutedate);
    res.status(200).json(value);
  })
  */
  // No está probada
  //router.get(`/${num}/pinchat`, async (req, res) =>{
  //  const value = await client.pinChat();
  //  res.status(200).json(value);
  //})
  // No usar esto no entiendo que hace pero debo rearrancar el programa para que vuelva a funcionar
  //router.get(`/${p.number}/resetstate`, async (req, res) =>{
  //  const value = await p.client.resetState();
  //  res.status(200).json(value);
  //})
  
  // No está probada
  router.post(`/${num}/searchmessages`, async (req, res) =>{
    const { query, options } = req.body;
    const value = await client.searchMessages(query,options);
    res.status(200).json(value);
  })
  router.get(`/${num}/messages`, async (req, res) =>{
    const messages = await whatsapp.find({$or:[{from: `${num}@c.us`},{to: `${num}@c.us`}]}).sort({ timestamp: -1}).limit(200)
 
    res.status(200).json(messages);
  })

  // No está probada
  /*
  router.get(`/${num}/sendmessage`, async (req, res) =>{
    const { chatId, content, options } = req.query;
    const value = await client.sendMessage(chatId, content, options);
    res.status(200).json(value);
  })
  */
  router.get(`/${num}/available`, async (req, res) =>{
    const value = await client.sendPresenceAvailable();
    res.status(200).json('sendPresenceAvailable');
  })

  router.get(`/${num}/unavailable`, async (req, res) =>{
    const value = await client.sendPresenceUnavailable();
    res.status(200).json('sendPresenceUnavailable');
  })
  app.use(router);
}


const procesaMsg = async (client, msg:Message) => {
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

//  } else if (msg.body.startsWith('!subject ')) {
//      // Change the group subject
//      let chat = await msg.getChat();
//      if (chat.isGroup) {
//          let newSubject = msg.body.slice(9);
//          chat.setSubject(newSubject);
//      } else {
//          msg.reply('This command can only be used in a group!');
//      }
  } else if (msg.body.startsWith('!echo ')) {
      // Replies with the same message
      msg.reply(msg.body.slice(6));
//  } else if (msg.body.startsWith('!desc ')) {
//      // Change the group description
//      let chat = await msg.getChat();
//      if (chat.isGroup) {
//          let newDescription = msg.body.slice(6);
//          chat.setDescription(newDescription);
//      } else {
//          msg.reply('This command can only be used in a group!');
//      }
//  } else if (msg.body === '!leave') {
//      // Leave the group
//      let chat = await msg.getChat();
//      if (chat.isGroup) {
//          chat.leave();
//      } else {
//          msg.reply('This command can only be used in a group!');
//      }
  } else if (msg.body.startsWith('!join ')) {
      const inviteCode = msg.body.split(' ')[1];
      try {
          await client.acceptInvite(inviteCode);
          msg.reply('Joined the group!');
      } catch (e) {
          msg.reply('That invite code seems to be invalid.');
      }
  //} else if (msg.body === '!groupinfo') {
  //    let chat = await msg.getChat();
  //    if (chat.isGroup) {
  //        msg.reply(`
  //            *Group Details*
  //            Name: ${chat.name}
  //            Description: ${chat.description}
  //            Created At: ${chat.createdAt.toString()}
  //            Created By: ${chat.owner.user}
  //            Participant count: ${chat.participants.length}
  //        `);
  //    } else {
  //        msg.reply('This command can only be used in a group!');
  //    }
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
      const botones =  [{id:'customId',body:'button1'},{body:'button2'},{body:'button3'},{body:'button4'}] 
//      let button = new Buttons('Button body',[{id: '1', body:'bt1'},{id: '2', body:'bt2'},{id: '3', body:'bt3'}],'title','footer');
      let button = new Buttons('Button body',botones,'title','footer');
      console.log(button)
      client.sendMessage(msg.from, button);
  } else if (msg.body === '!list') {
      let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
      let list = new List('List body','btnText',sections,'Title','footer');
      client.sendMessage(msg.from, list);
  } else if (msg.body === '!reaction') {
      msg.react('👍');
  }
}
