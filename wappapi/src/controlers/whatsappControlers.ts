import { Request, Response, Router } from "express";
import * as qr from 'qr-image'
//import * as qrcode from 'qrcode-terminal';
import * as fs from 'fs';
import { Client, LocalAuth } from 'whatsapp-web.js'
import { WAG_Clients } from "../wapplib";
import whatsapp from "../models/whatsapp";
import phones from "../models/phones";
import  WappContacts  from "../models/contacts";
export const WAGControler:Router = Router();

WAGControler.get('/phones', 
  async (req:Request, res:Response) => {
  const pl = await phones.find();
  res.status(200).json(pl);
})

WAGControler.get('/phones/:id', async (req:Request, res:Response) => {
  const id = req.params.id;
  const pl = await phones.find({phone: id});
  res.status(200).json(pl);
})

WAGControler.get('/info/:contact',
  async (req:Request, res:Response) => {
  let {contact} = req.params;
  
  contact = contact.replace('+','');
  if(contact.length < 10){
    res.status(200).json({isWhatsapp: false});
    return;
  }

  contact = contact.length === 10 ? `549${contact}` : contact;
  console.log('busca', contact);
  const srvs = [];
  const clientes = [];
  /*
  for (const key in WAG_Clients) {
    if (Object.prototype.hasOwnProperty.call(WAG_Clients, key)) {
      const {client} = WAG_Clients[key];
      clientes.push(client);
      srvs.push(client.getState());
    }
  }
  const srvsConnected = await Promise.allSettled(srvs);
  console.log(srvsConnected);
  const getinfo = [];
  for (let index = 0; index < srvsConnected.length; index++) {
    const element = srvsConnected[index];
    if(element.status === 'fulfilled' && element.value === 'CONNECTTED'){
      getinfo.push(clientes[index].client.getNumberId(contact))
    }
  }
  */
  for (const key in WAG_Clients) {
    if (Object.prototype.hasOwnProperty.call(WAG_Clients, key)) {
      const element = WAG_Clients[key];
      const {client} = WAG_Clients[key];
      console.log('WAG_Clients',key)
      console.log(key, await client.getState());

      try {
        const cuser = await client.getNumberId(contact);
        if (cuser){
          const user = await client.getContactById(`${cuser._serialized}`);
          //const about = await user.getAbout();
          //const picUrl = await client.getProfilePicUrl(`${cuser._serialized}`);
          //const formatedNumber = await client.getFormattedNumber(`${cuser._serialized}`);
          //res.status(200).json({isWhatsapp: true, user, about, picUrl, formatedNumber});
          res.status(200).json({isWhatsapp: true, user});
        } else {
          res.status(200).json({isWhatsapp: false});
        }
        break;
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    }
  }
})


WAGControler.get('/info/:contact/extra',
  async (req:Request, res:Response) => {
  let {contact} = req.params;
  
  contact = contact.replace('+','');
  if(contact.length < 10){
    res.status(200).json({isWhatsapp: false});
    return;
  }

  contact = contact.length === 10 ? `549${contact}` : contact;
  console.log('busca', contact);
  const srvs = [];
  const clientes = [];
  for (const key in WAG_Clients) {
    if (Object.prototype.hasOwnProperty.call(WAG_Clients, key)) {
      const element = WAG_Clients[key];
      const {client} = WAG_Clients[key];
      console.log(key, await client.getState());

      try {
        const cuser = await client.getNumberId(contact);
        if (cuser){
          const user = await client.getContactById(`${cuser._serialized}`);
          const about = await user.getAbout();
          const picUrl = await client.getProfilePicUrl(`${cuser._serialized}`);
          const formatedNumber = await client.getFormattedNumber(`${cuser._serialized}`);
          res.status(200).json({isWhatsapp: true, user, about, picUrl, formatedNumber});
        } else {
          res.status(200).json({isWhatsapp: false});
        }
        break;
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    }
  }
})

WAGControler.post(`/sendto`, async (req:Request, res:Response) => {
  let { bot, to, msg } = req.body;
/*
  to = to.replace('+','');
  if(to.length < 10){
    res.status(200).json({isWhatsapp: false});
    return;
  }

  to = to.length === 10 ? `549${to}` : to;
*/
  if (!Object.prototype.hasOwnProperty.call(WAG_Clients, bot)) {
    return res.status(200).json({message: `${bot} no está registrado para enviar mensajes`, title: `Bot Inválido`})
  }
  const {client} = WAG_Clients[`${bot}`];
  const state = await client.getState();
  if(state!== 'CONNECTED') {
    return res.status(200).json({message:`${bot} - ${state}`})
  }
  const {_serialized } = await client.getNumberId(to)
  let info = client.info;

  const ret = await client.sendMessage(_serialized,msg);
  res.status(200).json(ret);
})

WAGControler.get(`/messages/:num`, async (req, res) =>{
  const {num} = req.params
  try {
    const messages = await whatsapp.find({$or:[{from: `:num@c.us`},{to: `:num@c.us`}]}).sort({ timestamp: -1}).limit(200)
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json('Phone not found')    
  }
});
WAGControler.get(`/estados/:num`, async (req, res) =>{
  const {num} = req.params
  try {
    const messages = await whatsapp.find({from: `status@broadcast`, to: `:num@c.us`}).sort({ timestamp: -1}).limit(200)
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json('Phone not found')    
  }
});
WAGControler.get(`/chat/:num/:to`, async (req, res) =>{
  const {num, to} = req.params
  try {
    const messages = await whatsapp.find(
      {
        $or:[
          {from: `:num@c.us`, to: `${to}@c.us`},
          {from: `${to}@c.us`, to:`:num@c.us`}
        ]
      }
    ).sort({ timestamp: -1}).limit(200)
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json('Phone not found')    
  }
});
WAGControler.get(`/contacts/:num`, async (req, res) =>{
  const {num} = req.params;
  const {client} = WAG_Clients[num];
  if(client){
    const rcontactos = await client.getContacts();
    const datArray = []
    const contactos = rcontactos.filter(c => c.id.server !== 'lid');
    contactos.map( async c => {
      datArray.push(c.getAbout());
      datArray.push(c.getChat());
      datArray.push(c.getProfilePicUrl());
      datArray.push(c.getFormattedNumber());
      datArray.push(c.getCommonGroups());
    })
    const results = await Promise.all(datArray)
    //console.log(results);
    let i = 0;
    /*
    contactos.map(c => {
      c['chat'] = results[0+i];
      c['picUrl'] = results[1+i];
      c['fNumber'] = results[2+i];
      c['cGroups'] = results[3+i];
      i+=4;
    })
    */
    contactos.map(c => {
      c['about'] = results[0+i];
      c['chat'] = results[1+i];
      c['picUrl'] = results[2+i];
      c['fNumber'] = results[3+i];
      c['cGroups'] = results[4+i];
      i+=5;
    })
    const tosave = [];
    /*
    contactos.map( c => {
      const filter = {
        from: client.info.wid.user,
        phone: c.id.user
      }
      const reg = Object.assign({}, filter, c);
      tosave.push(contacts.findOneAndUpdate(filter,reg,{
        new: true,
        upsert: true
      }))
    })
    const ret = await Promise.all(tosave);
    */
    res.status(200).json(contactos);
  }
/*
  try {
    const messages = await contacts.find(
      {from: `:num`}
    ).sort({ timestamp: -1})//.limit(500)
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json('Phone not found')    
  }
*/
});

WAGControler.get(`/test/:num`, async (req, res) =>{
  const {num} = req.params
  const {client} = WAG_Clients[num];
  try {
    const messages = await client.getChats();
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json('Phone not found')    
  }
});
WAGControler.get(`/:num/state`, async (req, res) =>{
  const {num} = req.params
  const {client} = WAG_Clients[num];
  try {
    const value = await client.getState();
    res.status(200).json(value);
  } catch (error) {
    res.status(404).json('Phone not found')    
  }
});

  // 
  // Routes
  // 
  WAGControler.get(`/:num/blockedcontactos`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
      const contacts = await client.getBlockedContacts();
    res.status(200).json(contacts);
  })

  WAGControler.get(`/:num/blockedcontactos`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const contacts = await client.getBlockedContacts();
    res.status(200).json(contacts);
  })

  WAGControler.get(`/:num/chats`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    let limit = 100;
    const chats = await client.getChats();
    const contactsToRead = [];
    const picturesToRead = [];
    const msgToRead = [];
    for (let i = 0; i < chats.length; i++) {
      const e = chats[i];
      const limit = e.unreadCount + 20;
      //console.log(limit);
    //  e['messages'] = await e.fetchMessages( {limit} );
    //  //console.log(e['messages']);
      msgToRead.push( e.fetchMessages( {limit} ) );
    //    contactsToRead.push(e.getContact());
    //  //e['contacto'] = await e.getContact();
    //  //e['picUrl'] = await e['contacto'].getProfilePicUrl();
    }
    const msgs = await Promise.all(msgToRead);
    //////console.log(msgs);

//    const contacts = await Promise.all(contactsToRead);

    //const med = [];
    chats.map( async (c,i) => {
    //  msgs[i].map( async (m:Message) => {
    //    if(m.hasMedia) med.push(saveMedia(client,m));
    ////    if(m.hasMedia) await saveMedia(client,m)  
    //  });
      c['messages'] = msgs[i];
    });
    //const mediaData = await Promise.all(med);

    //const mediarslt = await Promise.all(mediaData);


    //chats.map( async (c,i) => {
    //  await c['messages'].map( async (m:any,j) => {
    //    let cnt = 0;
    //
    //    let loop = true;
    //    const r = 40;
    //    if( m['hasMedia'] === true ){
    //      //if (m['type'] === 'video'){
    //        do {
    //          ////console.log( '1',!mediarslt[m['mediaIdx']]?.data && cnt < r )
    //          if( !mediarslt[m['mediaIdx']]?.data && cnt < r )
    //          {
    //            mediarslt[m['mediaIdx']] = mediaData[m['mediaIdx']]
    //            cnt++;
    //            ////console.log(cnt);
    //            ////console.log('2',mediarslt[m['mediaIdx']]?.data || cnt >= r);
    //            if( mediarslt[m['mediaIdx']]?.data || cnt >= r ) loop = false;
    //          } else {
    //            loop = false;
    //          }
    //        } while ( loop );
    //
    //        //console.log(i,j,m['mediaIdx'], cnt, loop, mediarslt[m['mediaIdx']]?.data?.length);
    //        cnt = 0;
    //        ////console.log( mediarslt[m['mediaIdx']]);
    //      //}
    //    }
    //  })
    //});

    //console.log("envia Chats")
    //res.status(200).json({ chats, mediarslt });
    res.status(200).json({ chats });
  });

  WAGControler.get(`/:num/chats/:limit`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
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
      //  tosave.push( WAG_saveMsg(m) );
      //})
      //e['contacto'] = await e.getContact();
      //e['picUrl'] = await e['contacto'].getProfilePicUrl();
    }

    const rsleer = await Promise.all(leermsgs);
    const tmsgs = new Date().getTime() - ini;
    //console.log("leyo los msg", tmsgs)
    let cuenta = 0;
    rsleer.map(msgs => {
      msgs.map( msg  => {
        tosave.push(client.WAG_saveMsg(msg));
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

    ////console.log(results);
    res.status(200).json(ret);
  })

  WAGControler.get(`/:num/chat/:serialized`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const {serialized} = req.params
    const chat = await client.getChatById(serialized);
    const limit = chat.unreadCount + 10;
    chat['messages'] = await chat.fetchMessages({limit })
    res.status(200).json(chat);
  })

  WAGControler.get(`/:num/mediadata`, async (req, res) => {
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const {message, remote } = req.query;
    const chatId:any = remote ? remote : null;
    const fexist = fs.existsSync(`${__dirname}/../mediaReceive/${message}.json`);
    let fr:any;
    if(fexist){
      fr = JSON.parse(fs.readFileSync(`${__dirname}/../mediaReceive/${message}.json`,{encoding: 'utf8', flag: 'r'}));
      if(!fr?.data){
        const msgs = await client.searchMessages('',{ chatId, limit:15200});
      } 
    }
    
    ////console.log(fr);
    ////console.log(fr.mimetype);
    ////console.log(fr.data);
    
    //res.set('Content-Type', fr.mimetype);
    //res.set('Content-Length', fr.data.length);
    //const buffer = Buffer.from(fr.data, 'base64');
    res.send(fr);
  });

  WAGControler.get(`/:num/schat/:serialized`, async ( req, res ) => {
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const { serialized } = req.params;
    let ret = await whatsapp.find(
        { $or: [ { from: serialized, to: `:num@c.us` }, { from: `:num@c.us`, to: serialized } ] }
    ).sort({timestamp: 1});
    res.status(200).json(ret);
  });

  WAGControler.get(`/:num/chat/:serialized/labels`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const {serialized} = req.params
    const value = await client.getChatLabels(serialized);
    res.status(200).json(value);
  })

  WAGControler.get(`/:num/chatsbylabel/:id`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const {id} = req.params
    const value = await client.getChatLabels(id);
    res.status(200).json(value);
  })

  WAGControler.get(`/:num/commongroups/:serialized`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const {serialized} = req.params
    const value = await client.getCommonGroups(serialized);
    res.status(200).json(value);
  })

  WAGControler.post(`/:num/contacts`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const filter = {
      from: num,
      phone: req.body.phone
    }
    const ret = await WappContacts.findOneAndUpdate(filter,req.body,{
      new: true,
      upsert: true
    })
    res.status(200).json(ret);
  });

  WAGControler.get(`/:num/contacts`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const value = await client.getState();
    if( `${value}` !== 'NAVIGATION' ){
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
      const tosave = []
      contacts.map( c => {
        const filter = {
          from: client.info.wid.user,
          phone: c.id.user
        }
        const reg = Object.assign({}, filter, c);
        tosave.push(WappContacts.findOneAndUpdate(filter,reg,{
          new: true,
          upsert: true
        }))
      })
      const ret = await Promise.all(tosave);
      res.status(200).json(ret);
    } else {
      res.status(401).json("WhatsApp no conectado")
    }
  });

  WAGControler.get(`/:num/contact/:serialized`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const {serialized} = req.params
    const contact = await client.getContactById(serialized);
    const picUrl = await contact.getProfilePicUrl() 
    res.status(200).json({ contact, picUrl });
  })

  WAGControler.get(`/:num/countrycode/:number`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const {number} = req.params
    const value = await client.getCountryCode(number);
    res.status(200).json(value);
  })

  WAGControler.get(`/:num/formattednumber/:number`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const value = await client.getFormattedNumber(num);
    res.status(200).json(value);
  })

  WAGControler.get(`/:num/invitedinfo/:code`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const {code} = req.params
    const value = await client.getInviteInfo(code);
    res.status(200).json(value);
  })

  WAGControler.get(`/:num/labels`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const value = await client.getLabels();
    res.status(200).json(value);
  })

  WAGControler.get(`/:num/numberid/:number`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const value = await client.getNumberId(num);
    res.status(200).json(value);
  })

  WAGControler.get(`/:num/profilepicurl/:serialized`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const {serialized} = req.params
    const value = await client.getProfilePicUrl(serialized);
    res.status(200).json(value);
  })

  WAGControler.get(`/:num/state`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const value = await client.getState();
    res.status(200).json(value);
  })

  WAGControler.get(`/:num/wwebversion`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const value = await client.getWWebVersion();
    res.status(200).json(value);
  })

  // No usar esto no entiendo que hace pero debo rearrancar el programa para que vuelva a funcionar
  //WAGControler.get(`/${p.number}/initialize`, async (req, res) =>{
  //  const value = await p.client.initialize();
  //  res.status(200).json(`${p.number} fue inicializado`);
  //})

  WAGControler.get(`/:num/isregistereduser/:id`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const { id } = req.params;
    const value = await client.isRegisteredUser(`${id}@c.us`);
    res.status(200).json(value);
  })

  WAGControler.get(`/:num/logout`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const value = await client.logout();
    res.status(200).json(`:num fue deslogueado`);
  })
  // No está probada
  WAGControler.get(`/:num/markchatunread/:id`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const { id } = req.params;
    const value = await client.markChatUnread(id);
    res.status(200).json(value);
  })

  // No está probada
  
  //WAGControler.get(`/:num/mutechat/:chatid/:unmutedate`, async (req, res) =>{
  //  const { chatid, unmutedate } = req.params;
  //  const value = await client.muteChat(chatid,unmutedate);
  //  res.status(200).json(value);
  //})
  
  // No está probada
  //WAGControler.get(`/:num/pinchat`, async (req, res) =>{
  //  const value = await client.pinChat();
  //  res.status(200).json(value);
  //})
  // No usar esto no entiendo que hace pero debo rearrancar el programa para que vuelva a funcionar
  //WAGControler.get(`/${p.number}/resetstate`, async (req, res) =>{
  //  const value = await p.client.resetState();
  //  res.status(200).json(value);
  //})

  // No está probada
  WAGControler.get(`/:num/searchmessages`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];

    const query:any = req.query.query;
    const options = {}

    if (req.query?.limit) options['limit'] = parseInt(req.query.limit.toString());
    if (req.query?.page) options['page'] = parseInt(req.query.page.toString());
    if (req.query?.chatid) options['chatId'] = req.query.chatid;

    const value = await client.searchMessages(query,options);
    res.status(200).json(value);
  });

  WAGControler.get(`/:num/messages`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const messages = await whatsapp.find({$or:[{from: `${num}@c.us`},{to: `${num}@c.us`}]}).sort({ timestamp: -1}).limit(200)
    res.status(200).json(messages);
  });

  // No está probada
  
  //WAGControler.get(`/:num/sendmessage`, async (req, res) =>{
  //  const { chatId, content, options } = req.query;
  //  const value = await client.sendMessage(chatId, content, options);
  //  res.status(200).json(value);
  //})
  
  WAGControler.get(`/:num/available`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const value = await client.sendPresenceAvailable();
    res.status(200).json('sendPresenceAvailable');
  })

  WAGControler.get(`/:num/unavailable`, async (req, res) =>{
    const {num} = req.params;
    const {client} = WAG_Clients[num];
    const value = await client.sendPresenceUnavailable();
    res.status(200).json('sendPresenceUnavailable');
  });
