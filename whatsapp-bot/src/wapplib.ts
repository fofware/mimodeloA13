import { Socket } from 'socket.io';
import { Buttons, Client, List, LocalAuth, Location, Message, MessageId, RemoteAuth } from 'whatsapp-web.js';
import whatsapp from './models/whatsapp';
import wappphone  from './models/phones';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const WAG_Clients:any = {};

export class WAG_Client {
  qrSend: number = 0;
  user: string;
  retriessend: number = 0;
  p:any;
  private sessionId: string;
  client: Client;
  private io: Socket;
  phone:string;
  owner:string;
  constructor(pp,skt:Socket){
    this.p = pp;
    this.io = skt;
    this.user = pp.user;
    this.phone = pp.phone;
    this.client = new Client({
      authStrategy: new LocalAuth(
        {
          clientId: this.p.sessionId,
        },
      ),
      qrMaxRetries: 5,
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });
    this.client.on('auth_failure', async (err) =>  {
      console.log('auth_failure')
      await this.io.to(this.phone).emit('auth_failure',err);
      console.error(err);
    });
    this.client.on('authenticated', async (session) => {
      console.log(`Authenticated`,this.phone);
    });
    this.client.on('change_battery', async (batteryInfo) => {
      await this.io.to(this.phone).emit('change_battery',{phone: this.client.info.wid.user, batteryInfo})
      //await io.to(p.rooms).emit('change_battery',{phone: client.info.wid.user, batteryInfo})
      console.log(`${this.client.info.pushname} ${this.client.info.wid.user} BatteryInfo ${batteryInfo}`);
    });

    this.client.on('change_state', async (state) => {
      console.log('change_state')
      await this.io.to(this.phone).emit('change_state',{phone: this.client.info.wid.user, state});
      //await io.to(p.rooms).emit('change_state',{phone: client.info.wid.user, state});
      console.log(`${this.client.info.pushname} ${this.client.info.wid.user} cambio de estado ${state}`);
    });

    this.client.on('disconnected', async (state) => {
      console.log('disconnected')
      console.log(state);
      if(`${state}` === 'Max qrcode retries reached'){
        await this.io.to(this.phone).emit('disconnected', state )
        //await io.to(p.rooms).emit('disconnected', state )
      } else {
        await this.io.to(this.phone).emit('change_state',{phone: this.client.info.wid.user, state})
        await this.io.to(this.phone).emit('disconnected',`${this.client.info.pushname} ${this.client.info.wid.user} disconnected ${state}`)
        await wappphone.findOneAndUpdate({user: this.user, phone: this.client.info.wid.user}, {activo: false})
        console.log('---------------------------------')
        console.log(`${this.client.info.pushname} ${this.client.info.wid.user} Desconecto`);
        //await client.logout();
      }
      //await client.resetState();
    });

    this.client.on('group_join', async (value) => {
      console.log('group_join')
      await this.io.to(this.client.info.wid.user).emit('group_join',value);
      //await io.to(p.rooms).emit('group_join',value)
      console.log(`${this.client.info.pushname} ${this.client.info.wid.user} group_join ${value}`);
    });

    this.client.on('group_leave', async (value) => {
      console.log('group_leave')
      await this.io.to(this.client.info.wid.user).emit('group_leave',value)
      //await io.to(p.rooms).emit('group_leave',value)
      console.log(`${this.client.info.pushname} ${this.client.info.wid.user} group_leave ${value}`);
    });

    this.client.on('incoming_call', async (value) => {
      console.log('incoming_call')
      await this.io.to(this.client.info.wid.user).emit('incoming_call',value);
      //await io.to(p.rooms).emit('incoming_call',value);
      console.log(`${this.client.info.pushname} ${this.client.info.wid.user} incoming_call ${value}`);
    });

    this.client.on('media_uploaded', async (value) => {
      console.log('media_uploaded')
      await this.io.to(this.client.info.wid.user).emit('media_uploaded',value);
      //await io.to(p.rooms).emit('media_uploaded',value);
      console.log(`${this.client.info.pushname} ${this.client.info.wid.user} media_uploaded ${value}`);
    });

    this.client.on('message', async msg => {
      try {
        const phone = this.client.info.wid.user;
        console.log('----------------------------------------------------')
        console.log(`${this.client.info.pushname} ${this.client.info.wid.user} MESSAGE RECEIVED`);
        console.log(msg.id);
        
        //if (msg.from !== 'status@broadcast'){
          const mediadata = await this.saveMedia(msg);
          //msg['contact'] = contact;
          //msg['chat'] = chat;
          const ret = await this.saveMsg(msg,'message');
    
          await this.io.to(this.client.info.wid.user).emit('message',{ msg, phone });
          //await io.to(phone).emit('message',{ msg, contact, chat, phone });
          //await io.to(p.rooms).emit('message',msg,mediadata);
    
          this.procesaMsg(msg);
  
        /*
        } else {
          console.log('--------------------- IGNORADO ---------------------')
          console.log(msg.from)
        }
        */
        this.showTime(msg);
      } catch (error) {
        console.log(`Error onMessage`)        
      }
    })

    this.client.on('message_ack', async (msg, ack) => {
      const phone = this.client.info.wid.user;
      console.log('----------------------------------------------------')
      console.log(`${this.client.info.pushname} ${this.client.info.wid.user} MESSAGE ACK`);
      console.log(msg.id);
      await this.io.to(this.client.info.wid.user).emit('message_ack', { msg, ack, phone });
      //await io.to(p.rooms).emit('message_ack',{msg,ack})

      const ret = await this.saveMsg(msg,'message_ack')
      const ackTxt = ['','se envio','recibió','leyó','Dio play al audio']
      //console.log('----------------------------------------------------')
      //console.log(`${client.info.pushname} ${client.info.wid.user} message_ack ${ack} ${msg.to} ${ackTxt[ack]}`);
      this.showTime(msg);
    })

    this.client.on('message_create', async (msg) => {
      try {
        const phone = this.client.info.wid.user;
        console.log('----------------------------------------------------')
        console.log(`${this.client.info.pushname} ${this.client.info.wid.user} MESSAGE_CREATE`);
        console.log(msg.id);
        console.log(`Message Body: ${msg.body}`)
  
        //if (msg.from !== 'status@broadcast'){
          //if(msg.fromMe){
            const mediadata = await this.saveMedia( msg );
        
            //msg['contact'] = await msg.getContact();
            //msg['chat'] = await msg.getChat();
      
            //await io.to(client.info.wid.user).emit('message_create', { msg, phone });
            //await io.to(phone).emit('message_create', { msg, contact, chat, phone });
            //await io.to(p.rooms).emit('message_create',msg,mediadata);
      
            //const ret = await saveMsg(msg,'message_create');
//            procesaMsg(client,msg);
          //}
        /*
        } else {
          console.log('--------------------- IGNORADO ---------------------');
          console.log(msg.from)
        }
        */
        //console.log('----------------------------------------------------');
        //console.log(`${client.info.pushname} ${client.info.wid.user} message_create`);
        //showTime(msg);
      } catch (error) {
        console.error(`Error en message_create`)        
      }

    });

    this.client.on('message_revoke_everyone', async (msg, revoked_msg) => {
      console.log('message_revoke_everyone')
      //gateways[client.info.wid.user].sockets.forEach( stk => stk.emit('message_revoke_everyone',{message,revoked_msg}))
      const phone = this.client.info.wid.user;
      const contact = await msg.getContact();
      const chat = await msg.getChat();
      //msg['on'] = 'message_revoke_everyone';
      //msg['serialized'] = msg.id._serialized; 
      //msg['revoked_msg'] = revoked_msg;
      console.log('----------------------------------------------------')
      console.log(`${this.client.info.pushname} ${this.client.info.wid.user} message_revoke_everyone`);
      console.log(msg.id);

      const ret = await this.saveMsg(msg,'message_revoke_everyone')

      await this.io.to(this.client.info.wid.user).emit('message_revoke_everyone',{ msg, revoked_msg, contact, chat, phone });
      //await io.to(p.rooms).emit('message_revoke_everyone',{msg,revoked_msg})
//      console.log('----------------------------------------------------')
//      console.log(`${client.info.pushname} ${client.info.wid.user} message_revoke_everyone`);
      this.showTime(msg);
    })

    this.client.on('qr', async qr => {
      console.log('qr',this.phone, this.p._id);
      //const picUrl = await client.getProfilePicUrl(`${numero}@c.us`)
      this.qrSend++;

      const qrMaxRetries = this.client['options']?.qrMaxRetries
      console.log(qrMaxRetries);
      await this.io.to(this.phone).emit('qr',{qr, qrSend: this.qrSend, qrMaxRetries, numero: this.client['toPhone']})
      //await io.to(p.rooms).emit('qr',{qr, qrSend, qrMaxRetries, numero: client['toPhone']})
  //     console.log(`${client.info.pushname} ${client.info.wid.user} qr=>`,qr);
      console.log("qr",qr);
      //resolve(client)
      //reject('Error necesita leer el qr')
    })

    this.client.on('ready', async (ready) => {
      //console.log(client.info.wid.user,'ready')
      await this.io.to(this.phone).emit('change_state',{phone: this.client.info.wid.user, state: 'CONNECTED'})
      await this.io.to(this.phone).emit('ready',`${this.client.info.pushname} ${this.client.info.wid.user} conected & ready`)
      //await io.to(p.rooms).emit('change_state',{phone: client.info.wid.user, state: 'CONNECTED'})
      //await io.to(p.rooms).emit('ready',`${client.info.pushname} ${client.info.wid.user} conected & ready`)
      const picUrl = await this.client.getProfilePicUrl(this.client.info.wid._serialized);
      
      await wappphone.findOneAndUpdate({user: this.client['user'], phone: this.client.info.wid.user}, {activo: true, picUrl})
      console.log(`${this.client.info.pushname} ${this.client.info.wid.user} connected & ready`);

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
      /**
       * Esto se hace de otra forma
       * aca se comenta hacer en otro lado 
       * y borrar
       */
      //const ruta = await wapproutes.find({phone: client.info.wid.user});
      //console.log("ruta",ruta);
      ////if (!ruta[0]?.phone) 
      //setRoutes(client);
  
    });

  }

  saveMedia ( msg:Message) {
    return new Promise( async (resolve, reject) => {
      let mediadata:any;
      const d = new Date;
      const timestamp = d.getTime()/1000;
  
  //    console.log( (d.getTime()/1000), msg.timestamp, timestamp - msg.timestamp );
  //    console.log(msg);
      const fn = `${__dirname}/../mediaReceive/${msg.id._serialized}.json`;
  
      let existe = fs.existsSync(fn)
      console.warn('saveMedia', msg.id._serialized, 'hasMedia', msg.hasMedia, 'existe', existe);
      if (!msg.hasMedia){
  //      console.log('Vuelve no medida data')
        existe = false;
      }
      if(msg.hasMedia && !existe){
        let veces = 0;
  //      console.log(msg);
        do {
          mediadata = {};
          try {
            veces++;
            mediadata = await msg.downloadMedia();
          } catch (error) {
            console.log('msg.downloadMedia(): Error');
            console.log(error);
          }
  //        console.log('veces', veces, msg.id._serialized, mediadata?.data?.length);
        } while (veces < 4 && !mediadata?.data?.length );
      
  //      console.log('veces', veces, msg.id._serialized, mediadata?.data.length);
  //console.warn('length', mediadata?.data?.length)
  //console.warn('data', mediadata?.data)
  //console.warn('mediadata', mediadata)
  
        if (mediadata?.data?.length > 0){
            console.log('graba media data');
            try {
  //            console.log(typeof(mediadata));
  //            console.log(mediadata);
              fs.writeFileSync(fn,JSON.stringify(mediadata),{encoding:"utf8"});
            } catch (error) {
              console.log('sale por catch error');
              console.log('mediadata', mediadata);
              console.log(error);
              existe = false;            
              resolve({existe})
            }
            existe = true;
            resolve({existe})
          } else {
          existe = false;
  //        console.log('no leyó media', `${msg.id._serialized}`)
          resolve({existe})
        }
      } else {
        //console.log('hasMedia', msg.hasMedia, 'existe', existe, 'no graba');
        resolve({existe})
      }
    })
  } 
  
  async procesaMsg (msg:Message) {
    console.log(`procesaMsg mensaje desde ${msg.from} para ${this.client.info.wid.user}`)
    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');
  
    } else if (msg.body === '!ping') {
        // Send a new message to the same chat
        this.client.sendMessage(msg.from, 'pong');
  
    } else if (msg.body.startsWith('!sendto ')) {
        // Direct send a new message to specific id
        let number = msg.body.split(' ')[1];
        let messageIndex = msg.body.indexOf(number) + number.length;
        let message = msg.body.slice(messageIndex, msg.body.length);
        number = number.includes('@c.us') ? number : `${number}@c.us`;
        let chat = await msg.getChat();
        chat.sendSeen();
        this.client.sendMessage(number, message);
  
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
            await this.client.acceptInvite(inviteCode);
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
        const chats = await this.client.getChats();
        this.client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
        for (let i = 0; i < chats.length; i++) {
          const element = chats[i];
          console.log(chats);
          this.client.sendMessage(msg.from, element.name);
        }
    } else if (msg.body === '!info') {
        let info = this.client.info;
        this.client.sendMessage(msg.from, `
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
            this.client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
        }
    } else if (msg.body === '!location') {
        msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
    } else if (msg.location) {
        msg.reply(msg.location);
    } else if (msg.body.startsWith('!status ')) {
        const newStatus = msg.body.split(' ')[1];
        await this.client.setStatus(newStatus);
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
            console.log(`!Jumpto: ${quotedMsg} not implemented yet`);
            //client. openChatWindowAt(quotedMsg.id._serialized);
        }
    } else if (msg.body === '!buttons') {
        const botones =  [{id:'customId',body:'button1'},{body:'button2'},{body:'button3'},{body:'button4'}] 
  //      let button = new Buttons('Button body',[{id: '1', body:'bt1'},{id: '2', body:'bt2'},{id: '3', body:'bt3'}],'title','footer');
        let button = new Buttons('Button body',botones,'title','footer');
        console.log(button)
        this.client.sendMessage(msg.from, button);
    } else if (msg.body === '!list') {
        let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
        let list = new List('List body','btnText',sections,'Title','footer');
        this.client.sendMessage(msg.from, list);
    } else if (msg.body === '!reaction') {
        msg.react('👍');
    }
  }
  async saveMsg (m:Message,desde?) {
    const findData:MessageId | any = m.id
    if(findData.participant)
    console.log(`author: ${m.author}`)
    console.log(`${desde}: desde ${findData?.participant || m.from}`);
    console.log(`para ${m.to}`)
    console.log(findData)
  
    try {
      let ret = await whatsapp.findOneAndUpdate(
        { id: findData},
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
      console.log(ret.lastErrorObject);
      //console.log(m.id,desde);
      //console.log(ret.value.id, ret.value._id);
      if(desde === 'message_revoke_everyone')
        console.log(ret);
      console.log('--------------------------------------------');
      return ret;
    } catch (error) {
      console.log(m,desde);
      console.log(error)
    }
  }

  showTime(msg) {
    if (msg.hasMedia){
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
  }
    
}

