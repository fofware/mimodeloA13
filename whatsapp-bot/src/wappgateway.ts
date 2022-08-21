import { Client, LegacySessionAuth, LocalAuth } from 'whatsapp-web.js';
import * as qr from 'qr-image';
import * as qrcode from 'qrcode-terminal';
import fs from 'fs';
import whatsapp from './models/whatsapp';
import waathenticated  from './models/authenticate';

export interface phoneGateway {
  cuenta: string;
  number: string;
  name: string;
  client?: any;
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
const documents = {};

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

  p.client.on('message', async message => {
    message['cuenta'] = p.cuenta;
    const ret = await whatsapp.insertMany([message])
    console.log(`${p.name} recibió un mensaje de ${message.from}`)
    if(message.body === '!ping') {
      message.reply('pong');
    }
  });
  
  p.client.on('message_ack', async (message, ack) => {
    console.log(`${p.name} message_ack`,ack);
    message['cuenta'] = p.cuenta;
    const ret = await whatsapp.insertMany([message])
    console.log(`${p.name} recibió un mensaje de ${message.from}`)
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
