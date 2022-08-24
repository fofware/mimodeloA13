import { Buttons, Client, LegacySessionAuth, List, LocalAuth, Location } from 'whatsapp-web.js';
import * as qr from 'qr-image';
import * as qrcode from 'qrcode-terminal';
import fs from 'fs';
import whatsapp from './models/whatsapp';
import waathenticated  from './models/authenticate';
import wappphone  from './models/phones';
export interface phoneGateway {
  cuenta: string;
  number: string;
  name: string;
  client?: any;
  socket?: any;
}

const WAClientEvent = (p, socket? ) => {
  /**
   * Eventos
   */
  p.client.on('auth_failure', err =>  {
    console.log(`${p.name} Authentication Error`);
    socket?.emit('wa:auth_failure',JSON.stringify(err));
    console.error(err);
  });

  p.client.on('authenticated', async (session) => {
    console.log(`${p.name} Authenticated`);
    console.log('p.client---------');
    console.log(p.client);
    console.log('session-------');
    console.log(session);
    
    const ret = await waathenticated.insertMany([session])
    socket?.emit('wa:authenticated',JSON.stringify(session))
    console.log(`${p.name} Authenticated`);
  });
  
  p.client.on('change_battery', (batteryInfo) => {
    socket?.emit('wa:change_battery',JSON.stringify(batteryInfo))
    console.log(`${p.name} BatteryInfo ${p.name}`);
  });
  
  p.client.on('change_state', (state) => {
    socket?.emit('wa:change_state',JSON.stringify(state))
    console.log(`${p.name} change_state ${state}`);
  });

  p.client.on('disconnected', (state) => {
    socket?.emit('wa:disconnected',JSON.stringify(state))
    console.log(`${p.name} disconnected ${state}`);
  });

  p.client.on('group_join', (value) => {
    socket?.emit('wa:group_join',JSON.stringify(value))
    console.log(`${p.name} group_join ${value}`);
  });

  p.client.on('group_leave', (value) => {
    socket?.emit('wa:group_leave',JSON.stringify(value))
    console.log(`${p.name} group_leave ${value}`);
  });

  p.client.on('incoming_call', (value) => {
    socket?.emit('wa:incoming_call',JSON.stringify(value))
    console.log(`${p.name} incoming_call ${value}`);
  });

  p.client.on('media_uploaded', (value) => {
    socket?.emit('wa:media_uploaded',JSON.stringify(value))
    console.log(`${p.name} media_uploaded ${value}`);
  });

  /*
    p.client.on('message', async message => {
    message['cuenta'] = p.cuenta;
    socket.emit('wa:message',JSON.stringify(message))
    const ret = await whatsapp.insertMany([message])
    console.log(`${p.name} recibió un mensaje de ${message.from}`)
    if(message.body === '!ping') {
      message.reply('pong');
    }
  });
  */
  p.client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } else if (msg.body === '!ping') {
        // Send a new message to the same chat
        p.client.sendMessage(msg.from, 'pong');

    } else if (msg.body.startsWith('!sendto ')) {
        // Direct send a new message to specific id
        let number = msg.body.split(' ')[1];
        let messageIndex = msg.body.indexOf(number) + number.length;
        let message = msg.body.slice(messageIndex, msg.body.length);
        number = number.includes('@c.us') ? number : `${number}@c.us`;
        let chat = await msg.getChat();
        chat.sendSeen();
        p.client.sendMessage(number, message);

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
            await p.client.acceptInvite(inviteCode);
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
        const chats = await p.client.getChats();
        p.client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
        for (let i = 0; i < chats.length; i++) {
          const element = chats[i];
          console.log(chats);
          p.client.sendMessage(msg.from, element.name);
        }
    } else if (msg.body === '!info') {
        let info = p.client.info;
        p.client.sendMessage(msg.from, `
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
            p.client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
        }
    } else if (msg.body === '!location') {
        msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
    } else if (msg.location) {
        msg.reply(msg.location);
    } else if (msg.body.startsWith('!status ')) {
        const newStatus = msg.body.split(' ')[1];
        await p.client.setStatus(newStatus);
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
            p.client.interface.openChatWindowAt(quotedMsg.id._serialized);
        }
    } else if (msg.body === '!buttons') {
        let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
        p.client.sendMessage(msg.from, button);
    } else if (msg.body === '!list') {
        let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
        let list = new List('List body','btnText',sections,'Title','footer');
        p.client.sendMessage(msg.from, list);
    } else if (msg.body === '!reaction') {
        msg.react('👍');
    }
  });

  p.client.on('message_ack', async (message, ack) => {
    socket?.emit('wa:message_ack',JSON.stringify({message,ack}))
    console.log(`${p.name} message_ack`,ack);
        message['cuenta'] = p.cuenta;
    const ret = await whatsapp.insertMany([message])
    console.log(`${p.name} recibió un mensaje de ${message.from}`)
  })

  p.client.on('message_create', async (message) => {
    message['cuenta'] = p.cuenta;
    socket?.emit('wa:message_create',JSON.stringify(message))
    const ret = await whatsapp.insertMany([message])
    console.log(`${p.name} message_create`, message);
  });

  p.client.on('message_revoke_everyone', (message, revoked_msg) => {
    socket?.emit('wa:message_revoke_everyone',JSON.stringify({message, revoked_msg}))
    console.log(`${p.name} message_revoke_everyone`, message);
    console.log(`${p.name} message_revoked`, revoked_msg);
  })
  
  p.client.on('qr', qr => {
    try {
      socket?.emit('wa:qr',qr)
      console.log("qr",qr);
    } catch (error) {
      console.log(error)      
    }
  })
  
  p.client.on('ready', async (ready) => {
    console.log('ready');
    console.log(ready);
    console.log('p.client');
    let info = p.client.info;
    const phone = {
      owner: p.owner,
      number: p.number,
      nombre: p.nombre,
      apellido: p.apellido,
      email: p.email,
      nickname: p.nickname,
      info
    }
    const existe:any = await wappphone.find({number: phone.number})
    console.log(existe);
    if(!existe._id) {
      const ret = await wappphone.insertMany([phone])
    }
    console.log(info);
    socket?.emit('wa:ready',JSON.stringify(ready))
    console.log(`${p.name} conected & ready`);
  })

}
const gateways = {}

export const initAllWapp = async () =>{
  
}

export const WAppRegister = (socket, p) =>{
  if (!gateways[p.number]) {
    p.client = new Client({
      authStrategy: new LocalAuth(
        {
          dataPath: './sessions/',
          clientId: `${p.owner}_${p.number}`
        }
      ),
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });
    p.client.initialize();
    WAClientEvent(p,socket)
  } else p = gateways[p.number]

} 

export const WAppClient = (socket, p) =>{
  if (!gateways[p.number]) {

    p.client = new Client({
      authStrategy: new LocalAuth(
        {
          dataPath: './sessions/',
          clientId: `${p.owner}_${p.number}`
        }
      ),
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });
    p.client.initialize();
    WAClientEvent(p, socket);
  } else p = gateways[p.number]

//  /**
//   * Eventos
//   */
//  p.client.on('auth_failure', err =>  {
//    console.log(`${p.name} Authentication Error`);
//    //socket.emit('wa:auth_failure',JSON.stringify(err));
//    console.error(err);
//  });
//
//  p.client.on('authenticated', async (session) => {
//    console.log(`${p.name} Authenticated`);
//    console.log('p.client---------');
//    console.log(p.client);
//    console.log('session-------');
//    console.log(session);
//    const ret = await waathenticated.insertMany([session])
//    //socket.emit('wa:authenticated',JSON.stringify(session))
//    console.log(`${p.name} Authenticated`);
//  });
//  
//  p.client.on('change_battery', (batteryInfo) => {
//    //socket.emit('wa:change_battery',JSON.stringify(batteryInfo))
//    console.log(`${p.name} BatteryInfo ${p.name}`);
//  });
//  
//  p.client.on('change_state', (state) => {
//    //socket.emit('wa:change_state',JSON.stringify(state))
//    console.log(`${p.name} change_state ${state}`);
//  });
//
//  p.client.on('disconnected', (state) => {
//    //socket.emit('wa:disconnected',JSON.stringify(state))
//    console.log(`${p.name} disconnected ${state}`);
//  });
//
//  p.client.on('group_join', (value) => {
//    //socket.emit('wa:group_join',JSON.stringify(value))
//    console.log(`${p.name} group_join ${value}`);
//  });
//
//  p.client.on('group_leave', (value) => {
//    //socket.emit('wa:group_leave',JSON.stringify(value))
//    console.log(`${p.name} group_leave ${value}`);
//  });
//
//  p.client.on('incoming_call', (value) => {
//    //socket.emit('wa:incoming_call',JSON.stringify(value))
//    console.log(`${p.name} incoming_call ${value}`);
//  });
//
//  p.client.on('media_uploaded', (value) => {
//    //socket.emit('wa:media_uploaded',JSON.stringify(value))
//    console.log(`${p.name} media_uploaded ${value}`);
//  });
//
//  /*
//    p.client.on('message', async message => {
//    message['cuenta'] = p.cuenta;
//    socket.emit('wa:message',JSON.stringify(message))
//    const ret = await whatsapp.insertMany([message])
//    console.log(`${p.name} recibió un mensaje de ${message.from}`)
//    if(message.body === '!ping') {
//      message.reply('pong');
//    }
//  });
//  */
//  p.client.on('message', async msg => {
//    console.log('MESSAGE RECEIVED', msg);
//
//    if (msg.body === '!ping reply') {
//        // Send a new message as a reply to the current one
//        msg.reply('pong');
//
//    } else if (msg.body === '!ping') {
//        // Send a new message to the same chat
//        p.client.sendMessage(msg.from, 'pong');
//
//    } else if (msg.body.startsWith('!sendto ')) {
//        // Direct send a new message to specific id
//        let number = msg.body.split(' ')[1];
//        let messageIndex = msg.body.indexOf(number) + number.length;
//        let message = msg.body.slice(messageIndex, msg.body.length);
//        number = number.includes('@c.us') ? number : `${number}@c.us`;
//        let chat = await msg.getChat();
//        chat.sendSeen();
//        p.client.sendMessage(number, message);
//
//    } else if (msg.body.startsWith('!subject ')) {
//        // Change the group subject
//        let chat = await msg.getChat();
//        if (chat.isGroup) {
//            let newSubject = msg.body.slice(9);
//            chat.setSubject(newSubject);
//        } else {
//            msg.reply('This command can only be used in a group!');
//        }
//    } else if (msg.body.startsWith('!echo ')) {
//        // Replies with the same message
//        msg.reply(msg.body.slice(6));
//    } else if (msg.body.startsWith('!desc ')) {
//        // Change the group description
//        let chat = await msg.getChat();
//        if (chat.isGroup) {
//            let newDescription = msg.body.slice(6);
//            chat.setDescription(newDescription);
//        } else {
//            msg.reply('This command can only be used in a group!');
//        }
//    } else if (msg.body === '!leave') {
//        // Leave the group
//        let chat = await msg.getChat();
//        if (chat.isGroup) {
//            chat.leave();
//        } else {
//            msg.reply('This command can only be used in a group!');
//        }
//    } else if (msg.body.startsWith('!join ')) {
//        const inviteCode = msg.body.split(' ')[1];
//        try {
//            await p.client.acceptInvite(inviteCode);
//            msg.reply('Joined the group!');
//        } catch (e) {
//            msg.reply('That invite code seems to be invalid.');
//        }
//    } else if (msg.body === '!groupinfo') {
//        let chat = await msg.getChat();
//        if (chat.isGroup) {
//            msg.reply(`
//                *Group Details*
//                Name: ${chat.name}
//                Description: ${chat.description}
//                Created At: ${chat.createdAt.toString()}
//                Created By: ${chat.owner.user}
//                Participant count: ${chat.participants.length}
//            `);
//        } else {
//            msg.reply('This command can only be used in a group!');
//        }
//    } else if (msg.body === '!chats') {
//        const chats = await p.client.getChats();
//        p.client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
//        for (let i = 0; i < chats.length; i++) {
//          const element = chats[i];
//          console.log(chats);
//          p.client.sendMessage(msg.from, element.name);
//        }
//    } else if (msg.body === '!info') {
//        let info = p.client.info;
//        p.client.sendMessage(msg.from, `
//            *Connection info*
//            User name: ${info.pushname}
//            My number: ${info.wid.user}
//            Platform: ${info.platform}
//        `);
//    } else if (msg.body === '!mediainfo' && msg.hasMedia) {
//        const attachmentData = await msg.downloadMedia();
//        msg.reply(`
//            *Media info*
//            MimeType: ${attachmentData.mimetype}
//            Filename: ${attachmentData.filename}
//            Data (length): ${attachmentData.data.length}
//        `);
//    } else if (msg.body === '!quoteinfo' && msg.hasQuotedMsg) {
//        const quotedMsg = await msg.getQuotedMessage();
//
//        quotedMsg.reply(`
//            ID: ${quotedMsg.id._serialized}
//            Type: ${quotedMsg.type}
//            Author: ${quotedMsg.author || quotedMsg.from}
//            Timestamp: ${quotedMsg.timestamp}
//            Has Media? ${quotedMsg.hasMedia}
//        `);
//    } else if (msg.body === '!resendmedia' && msg.hasQuotedMsg) {
//        const quotedMsg = await msg.getQuotedMessage();
//        if (quotedMsg.hasMedia) {
//            const attachmentData = await quotedMsg.downloadMedia();
//            p.client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
//        }
//    } else if (msg.body === '!location') {
//        msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
//    } else if (msg.location) {
//        msg.reply(msg.location);
//    } else if (msg.body.startsWith('!status ')) {
//        const newStatus = msg.body.split(' ')[1];
//        await p.client.setStatus(newStatus);
//        msg.reply(`Status was updated to *${newStatus}*`);
//    } else if (msg.body === '!mention') {
//        const contact = await msg.getContact();
//        const chat = await msg.getChat();
//        chat.sendMessage(`Hi @${contact.number}!`, {
//            mentions: [contact]
//        });
//    } else if (msg.body === '!delete') {
//        if (msg.hasQuotedMsg) {
//            const quotedMsg = await msg.getQuotedMessage();
//            if (quotedMsg.fromMe) {
//                quotedMsg.delete(true);
//            } else {
//                msg.reply('I can only delete my own messages');
//            }
//        }
//    } else if (msg.body === '!pin') {
//        const chat = await msg.getChat();
//        await chat.pin();
//    } else if (msg.body === '!archive') {
//        const chat = await msg.getChat();
//        await chat.archive();
//    } else if (msg.body === '!mute') {
//        const chat = await msg.getChat();
//        // mute the chat for 20 seconds
//        const unmuteDate = new Date();
//        unmuteDate.setSeconds(unmuteDate.getSeconds() + 20);
//        await chat.mute(unmuteDate);
//    } else if (msg.body === '!typing') {
//        const chat = await msg.getChat();
//        // simulates typing in the chat
//        chat.sendStateTyping();
//    } else if (msg.body === '!recording') {
//        const chat = await msg.getChat();
//        // simulates recording audio in the chat
//        chat.sendStateRecording();
//    } else if (msg.body === '!clearstate') {
//        const chat = await msg.getChat();
//        // stops typing or recording in the chat
//        chat.clearState();
//    } else if (msg.body === '!jumpto') {
//        if (msg.hasQuotedMsg) {
//            const quotedMsg = await msg.getQuotedMessage();
//            p.client.interface.openChatWindowAt(quotedMsg.id._serialized);
//        }
//    } else if (msg.body === '!buttons') {
//        let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
//        p.client.sendMessage(msg.from, button);
//    } else if (msg.body === '!list') {
//        let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
//        let list = new List('List body','btnText',sections,'Title','footer');
//        p.client.sendMessage(msg.from, list);
//    } else if (msg.body === '!reaction') {
//        msg.react('👍');
//    }
//  });
//
//  p.client.on('message_ack', async (message, ack) => {
//    //socket.emit('wa:message_ack',JSON.stringify({message,ack}))
//    console.log(`${p.name} message_ack`,ack);
//        message['cuenta'] = p.cuenta;
//    const ret = await whatsapp.insertMany([message])
//    console.log(`${p.name} recibió un mensaje de ${message.from}`)
//  })
//
//  p.client.on('message_create', async (message) => {
//    message['cuenta'] = p.cuenta;
//    //socket.emit('wa:message_create',JSON.stringify(message))
//    const ret = await whatsapp.insertMany([message])
//    console.log(`${p.name} message_create`, message);
//  });
//
//  p.client.on('message_revoke_everyone', (message, revoked_msg) => {
//    //socket.emit('wa:message_revoke_everyone',JSON.stringify({message, revoked_msg}))
//    console.log(`${p.name} message_revoke_everyone`, message);
//    console.log(`${p.name} message_revoked`, revoked_msg);
//  })
//  
//  p.client.on('qr', qr => {
//    try {
//      console.log(p.client)
//      //socket.emit('wa:qr',qr)
//      console.log("qr",qr);
//    } catch (error) {
//      console.log(error)      
//    }
//  })
//  
//  p.client.on('ready', async (ready) => {
//    console.log('ready');
//    console.log(ready);
//    console.log('p.client');
//    let info = p.client.info;
//    const phone = {
//      cuenta: p.cuenta,
//      number: p.number,
//      name: p.name,
//      info
//    }
//    const ret = await wappphone.insertMany([phone])
//    console.log(info);
//    //socket.emit('wa:ready',JSON.stringify(ready))
//    console.log(`${p.name} conected & ready`);
//  })

  /**
   * Routes
   */
  //router.get(`/${p.number}/qr`, async (req, res) =>{
  //  const state = await p.client.getState();
  //  if(!state){
  //    try {
  //      res.set({'Content-type': 'image/svg+xml'})
  //      fs.createReadStream(`${__dirname}/../mediaSend/${p.number}.svg`).pipe(res);
  //      
  //    } catch (error) {
  //      res.status(400).json(error);
  //    }
  //  } else {
  //    res.status(200).json('desconecte el dispositivo para volver a generar un codigo qr')
  //  }
  //});
  /*
  router.get(`/${p.number}/blockedcontactos`, async (req, res) =>{
    const contacts = await p.client.getBlockedContacts();
    res.status(200).json(contacts);
  })

  router.get(`/${p.number}/blockedcontactos`, async (req, res) =>{
    const contacts = await p.client.getBlockedContacts();
    res.status(200).json(contacts);
  })

  router.get(`/${p.number}/chats`, async (req, res) =>{
    const contacts = await p.client.getChats();
    res.status(200).json(contacts);
  })

  router.get(`/${p.number}/chat/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await p.client.getChatById(serialized);
    res.status(200).json(value);
  })

  router.get(`/${p.number}/chat/:serialized/labels`, async (req, res) =>{
    const {serialized} = req.params
    const value = await p.client.getChatLabels(serialized);
    res.status(200).json(value);
  })

  router.get(`/${p.number}/chatsbylabel/:id`, async (req, res) =>{
    const {id} = req.params
    const value = await p.client.getChatLabels(id);
    res.status(200).json(value);
  })

  router.get(`/${p.number}/commongroups/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await p.client.getCommonGroups(serialized);
    res.status(200).json(value);
  })
  
  router.get(`/${p.number}/contactos`, async (req, res) =>{
    const contacts = await p.client.getContacts()
    res.status(200).json(contacts);
  });

  router.get(`/${p.number}/contact/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await p.client.getContactById(serialized);
    res.status(200).json(value);
  })

  router.get(`/countrycode/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await p.client.getCountryCode(number);
    res.status(200).json(value);
  })

  router.get(`/formattednumber/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await p.client.getFormattedNumber(number);
    res.status(200).json(value);
  })

  router.get(`/${p.number}/invitedinfo/:code`, async (req, res) =>{
    const {code} = req.params
    const value = await p.client.getInviteInfo(code);
    res.status(200).json(value);
  })

  router.get(`/labels`, async (req, res) =>{
    const value = await p.client.getLabels();
    res.status(200).json(value);
  })

  router.get(`/numberid/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await p.client.getNumberId(number);
    res.status(200).json(value);
  })

  router.get(`/profilepicurl/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await p.client.getProfilePicUrl(serialized);
    res.status(200).json(value);
  })

  router.get(`/${p.number}/state`, async (req, res) =>{
    const value = await p.client.getState();
    res.status(200).json(value);
  })

  router.get(`/${p.number}/wwebversion`, async (req, res) =>{
    const value = await p.client.getWWebVersion();
    res.status(200).json(value);
  })
  
  // No usar esto no entiendo que hace pero debo rearrancar el programa para que vuelva a funcionar
  //router.get(`/${p.number}/initialize`, async (req, res) =>{
  //  const value = await p.client.initialize();
  //  res.status(200).json(`${p.number} fue inicializado`);
  //})

  router.get(`/isregistereduser/:id`, async (req, res) =>{
    const { id } = req.params;
    const value = await p.client.isRegisteredUser(`${id}@c.us`);
    res.status(200).json(value);
  })
  
  router.get(`/${p.number}/logout`, async (req, res) =>{
    const value = await p.client.logout();
    res.status(200).json(`${p.number} fue deslogueado`);
  })
  // No está probada
  router.get(`/${p.number}/markchatunread/:id`, async (req, res) =>{
    const { id } = req.params;
    const value = await p.client.markChatUnread(id);
    res.status(200).json(value);
  })

  // No está probada
  router.get(`/${p.number}/mutechat/:chatid/:unmutedate`, async (req, res) =>{
    const { chatid, unmutedate } = req.params;
    const value = await p.client.muteChat(chatid,unmutedate);
    res.status(200).json(value);
  })
  
  // No está probada
  router.get(`/${p.number}/mutechat/:chatid/:unmutedate`, async (req, res) =>{
    const { chatid, unmutedate } = req.params;
    const value = await p.client.muteChat(chatid,unmutedate);
    res.status(200).json(value);
  })

  // No está probada
  router.get(`/${p.number}/pinchat`, async (req, res) =>{
    const value = await p.client.pinChat();
    res.status(200).json(value);
  })
  // No usar esto no entiendo que hace pero debo rearrancar el programa para que vuelva a funcionar
  //router.get(`/${p.number}/resetstate`, async (req, res) =>{
  //  const value = await p.client.resetState();
  //  res.status(200).json(value);
  //})
  
  // No está probada
  router.post(`/${p.number}/searchmessages`, async (req, res) =>{
    const { query, options } = req.body;
    const value = await p.client.searchMessages(query,options);
    res.status(200).json(value);
  })

  // No está probada
  router.post(`/${p.number}/sendmessage`, async (req, res) =>{
    const { chatId, content, options } = req.query;
    const value = await p.client.sendMessage(chatId, content, options);
    res.status(200).json(value);
  })
  
  router.get(`/${p.number}/available`, async (req, res) =>{
    const value = await p.client.sendPresenceAvailable();
    res.status(200).json('sendPresenceAvailable');
  })

  router.get(`/${p.number}/unavailable`, async (req, res) =>{
    const value = await p.client.sendPresenceUnavailable();
    res.status(200).json('sendPresenceUnavailable');
  })
  */
}

export const WAppGateway = (p:phoneGateway, router) =>{
  p.client = new Client({
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
  p.client.initialize();


  /**
   * Eventos
   */

  p.client.on('auth_failure', err =>  {
    console.log(`${p.name} Authentication Error`);
    console.error(err);
  });

  p.client.on('authenticated', async (session) => {
    const data = {
      cuenta: p.cuenta,
      number: p.number,
      name: p.name,
      session: session
    }

    const ret = await waathenticated.insertMany([data])

    console.log(`${p.name} Authenticated`);
  });
  
  p.client.on('change_battery', (batteryInfo) => {
    console.log(`${p.name} BatteryInfo ${p.name}`);
  });
  
  p.client.on('change_state', (state) => {
    console.log(`${p.name} change_state ${state}`);
  });

  p.client.on('disconnected', (state) => {
    console.log(`${p.name} disconnected ${state}`);
  });

  p.client.on('group_join', (value) => {
    console.log(`${p.name} group_join ${value}`);
  });

  p.client.on('group_leave', (value) => {
    console.log(`${p.name} group_leave ${value}`);
  });

  p.client.on('incoming_call', (value) => {
    console.log(`${p.name} incoming_call ${value}`);
  });

  p.client.on('media_uploaded', (value) => {
    console.log(`${p.name} media_uploaded ${value}`);
  });

  /*
  p.client.on('message', async message => {
    message['cuenta'] = p.cuenta;
    const ret = await whatsapp.insertMany([message])
    console.log(`${p.name} recibió un mensaje de ${message.from}`)
    if(message.body === '!ping') {
      message.reply('pong');
    }
  });
  */
  p.client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } else if (msg.body === '!ping') {
        // Send a new message to the same chat
        p.client.sendMessage(msg.from, 'pong');

    } else if (msg.body.startsWith('!sendto ')) {
        // Direct send a new message to specific id
        let number = msg.body.split(' ')[1];
        let messageIndex = msg.body.indexOf(number) + number.length;
        let message = msg.body.slice(messageIndex, msg.body.length);
        number = number.includes('@c.us') ? number : `${number}@c.us`;
        let chat = await msg.getChat();
        chat.sendSeen();
        p.client.sendMessage(number, message);

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
            await p.client.acceptInvite(inviteCode);
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
        const chats = await p.client.getChats();
        p.client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
    } else if (msg.body === '!info') {
        let info = p.client.info;
        p.client.sendMessage(msg.from, `
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
            p.client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
        }
    } else if (msg.body === '!location') {
        msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
    } else if (msg.location) {
        msg.reply(msg.location);
    } else if (msg.body.startsWith('!status ')) {
        const newStatus = msg.body.split(' ')[1];
        await p.client.setStatus(newStatus);
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
            p.client.interface.openChatWindowAt(quotedMsg.id._serialized);
        }
    } else if (msg.body === '!buttons') {
        let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
        p.client.sendMessage(msg.from, button);
    } else if (msg.body === '!list') {
        let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
        let list = new List('List body','btnText',sections,'Title','footer');
        p.client.sendMessage(msg.from, list);
    } else if (msg.body === '!reaction') {
        msg.react('👍');
    }
  });

  p.client.on('message_ack', async (message, ack) => {
    console.log(`${p.name} message_ack`,ack);
    message['cuenta'] = p.cuenta;
    const ret = await whatsapp.insertMany([message])
    console.log(`${p.name} recibió un mensaje de ${message.to}`)
    if(message.body === '!ping') {
      message.reply('pong');
    }
  })

  p.client.on('message_create', async (message) => {
    message['cuenta'] = p.cuenta;
    const ret = await whatsapp.insertMany([message])
    console.log(`${p.name} message_create`, message);
    if(message.body === '!ping') {
      message.reply('pong');
    }

  });

  p.client.on('message_revoke_everyone', (message, revoked_msg) => {
    console.log(`${p.name} message_revoke_everyone`, message);
    console.log(`${p.name} message_revoked`, revoked_msg);
  })
  
  p.client.on('qr', qr => generateImage(p.number,qr, () => {
    try {
      console.log("qr",qr);
      qrcode.generate(qr, { small: true });
    } catch (error) {
      console.log(error)      
    }
  }))
  
  p.client.on('ready', async () => {
    console.log(`${p.name} conected & ready`);
  })

  /**
   * Routes
   */
  router.get(`/${p.number}/qr`, async (req, res) =>{
    const state = await p.client.getState();
    if(!state){
      try {
        res.set({'Content-type': 'image/svg+xml'})
        fs.createReadStream(`${__dirname}/../mediaSend/${p.number}.svg`).pipe(res);
        
      } catch (error) {
        res.status(400).json(error);
      }
    } else {
      res.status(200).json('desconecte el dispositivo para volver a generar un codigo qr')
    }
  });

  router.get(`/${p.number}/blockedcontactos`, async (req, res) =>{
    const contacts = await p.client.getBlockedContacts();
    res.status(200).json(contacts);
  })

  router.get(`/${p.number}/blockedcontactos`, async (req, res) =>{
    const contacts = await p.client.getBlockedContacts();
    res.status(200).json(contacts);
  })

  router.get(`/${p.number}/chats`, async (req, res) =>{
    const contacts = await p.client.getChats();
    res.status(200).json(contacts);
  })

  router.get(`/${p.number}/chat/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await p.client.getChatById(serialized);
    res.status(200).json(value);
  })

  router.get(`/${p.number}/chat/:serialized/labels`, async (req, res) =>{
    const {serialized} = req.params
    const value = await p.client.getChatLabels(serialized);
    res.status(200).json(value);
  })

  router.get(`/${p.number}/chatsbylabel/:id`, async (req, res) =>{
    const {id} = req.params
    const value = await p.client.getChatLabels(id);
    res.status(200).json(value);
  })

  router.get(`/${p.number}/commongroups/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await p.client.getCommonGroups(serialized);
    res.status(200).json(value);
  })
  
  router.get(`/${p.number}/contactos`, async (req, res) =>{
    const contacts = await p.client.getContacts()
    res.status(200).json(contacts);
  });

  router.get(`/${p.number}/contact/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await p.client.getContactById(serialized);
    res.status(200).json(value);
  })

  router.get(`/countrycode/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await p.client.getCountryCode(number);
    res.status(200).json(value);
  })

  router.get(`/formattednumber/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await p.client.getFormattedNumber(number);
    res.status(200).json(value);
  })

  router.get(`/${p.number}/invitedinfo/:code`, async (req, res) =>{
    const {code} = req.params
    const value = await p.client.getInviteInfo(code);
    res.status(200).json(value);
  })

  router.get(`/labels`, async (req, res) =>{
    const value = await p.client.getLabels();
    res.status(200).json(value);
  })

  router.get(`/numberid/:number`, async (req, res) =>{
    const {number} = req.params
    const value = await p.client.getNumberId(number);
    res.status(200).json(value);
  })

  router.get(`/profilepicurl/:serialized`, async (req, res) =>{
    const {serialized} = req.params
    const value = await p.client.getProfilePicUrl(serialized);
    res.status(200).json(value);
  })

  router.get(`/${p.number}/state`, async (req, res) =>{
    const value = await p.client.getState();
    res.status(200).json(value);
  })

  router.get(`/${p.number}/wwebversion`, async (req, res) =>{
    const value = await p.client.getWWebVersion();
    res.status(200).json(value);
  })
  
  // No usar esto no entiendo que hace pero debo rearrancar el programa para que vuelva a funcionar
  //router.get(`/${p.number}/initialize`, async (req, res) =>{
  //  const value = await p.client.initialize();
  //  res.status(200).json(`${p.number} fue inicializado`);
  //})

  router.get(`/isregistereduser/:id`, async (req, res) =>{
    const { id } = req.params;
    const value = await p.client.isRegisteredUser(`${id}@c.us`);
    res.status(200).json(value);
  })
  
  router.get(`/${p.number}/logout`, async (req, res) =>{
    const value = await p.client.logout();
    res.status(200).json(`${p.number} fue deslogueado`);
  })
  // No está probada
  router.get(`/${p.number}/markchatunread/:id`, async (req, res) =>{
    const { id } = req.params;
    const value = await p.client.markChatUnread(id);
    res.status(200).json(value);
  })

  // No está probada
  router.get(`/${p.number}/mutechat/:chatid/:unmutedate`, async (req, res) =>{
    const { chatid, unmutedate } = req.params;
    const value = await p.client.muteChat(chatid,unmutedate);
    res.status(200).json(value);
  })
  
  // No está probada
  router.get(`/${p.number}/mutechat/:chatid/:unmutedate`, async (req, res) =>{
    const { chatid, unmutedate } = req.params;
    const value = await p.client.muteChat(chatid,unmutedate);
    res.status(200).json(value);
  })

  // No está probada
  router.get(`/${p.number}/pinchat`, async (req, res) =>{
    const value = await p.client.pinChat();
    res.status(200).json(value);
  })
  // No usar esto no entiendo que hace pero debo rearrancar el programa para que vuelva a funcionar
  //router.get(`/${p.number}/resetstate`, async (req, res) =>{
  //  const value = await p.client.resetState();
  //  res.status(200).json(value);
  //})
  
  // No está probada
  router.post(`/${p.number}/searchmessages`, async (req, res) =>{
    const { query, options } = req.body;
    const value = await p.client.searchMessages(query,options);
    res.status(200).json(value);
  })

  // No está probada
  router.post(`/${p.number}/sendmessage`, async (req, res) =>{
    const { chatId, content, options } = req.query;
    const value = await p.client.sendMessage(chatId, content, options);
    res.status(200).json(value);
  })
  
  router.get(`/${p.number}/available`, async (req, res) =>{
    const value = await p.client.sendPresenceAvailable();
    res.status(200).json('sendPresenceAvailable');
  })

  router.get(`/${p.number}/unavailable`, async (req, res) =>{
    const value = await p.client.sendPresenceUnavailable();
    res.status(200).json('sendPresenceUnavailable');
  })
}
const generateImage = (number,base64, cb = () => {}) => {
  let qr_svg = qr.image(base64, { type: 'svg', margin: 20 });
  qr_svg.pipe(require('fs').createWriteStream(`./mediaSend/${number}.svg`));
  /*
  router.get(`/qr/${number}`, (req, res) =>{
    res.set({'Content-type': 'image/svg+xml'})
    fs.createReadStream(`${__dirname}/../mediaSend/${number}.svg`).pipe(res);
  })
  console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
  console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
  */
  //cb()
}
