/**
 * https://www.youtube.com/watch?v=eWlt6ahx480
 * https://www.youtube.com/watch?v=6bAp_cvZet8&list=RDCMUCgrIGp5QAnC0J8LfNJxDRDw
 * https://github.com/leifermendez/bot-whatsapp
 * https://www.npmjs.com/package/whatsapp-web.js/v/1.16.4-alpha.
 * https://github.com/pedroslopez/whatsapp-web.js/blob/main/example.js
 */


import app from './app';
import {Server as WebSocketServer} from 'socket.io'
import http from 'http';
import { connectMongodb } from './dbConnect';
import sockets from './sockets';
import config  from './config';
connectMongodb();

import * as qrcode from 'qrcode-terminal';
import * as fs from 'fs';
//const client = new Client({
//  authStrategy: new LocalAuth(
//    {
//      dataPath: './sessions/',
//      clientId: 'firulais'
//    }
//  ),
//  puppeteer: {
//		args: ['--no-sandbox'],
//	}
//});
//
//client.initialize();
//
///**
//  client.on('qr', qr => {
//  qrcode.generate(qr, {small: true} );
//})
//*/
//
//client.on('qr', qr => generateImage(qr, () => {
//  qrcode.generate(qr, { small: true });
//  console.log(`Ver QR http://localhost:${port}/qr`)
//}))
//
//
//client.on('ready', () => {
//  console.log('WhatsApp Ready');
//  let chatId = `5493624380337@c.us`
//  client.sendMessage(chatId,'Hola Mundo!')
//    .then( response => {
//      if(response.id.fromMe){
//        console.log('El mensaje fue enviado');
//      }
//    })
//})
//
//client.on('authenticated', (session) => {
//  sessionData = session;
//  console.log('authenticated', session);
//});
//
//client.on('auth_failure', err =>  {
//  console.error('Error en Authentication');
//  console.error(err);
//});
//client.on('message', async message => {
//  console.log(message)
//  await whatsapp.insertMany([message])
//	if(message.body === '!ping') {
//		message.reply('pong');
//	}
//});
//
//const client1 = new Client({
//  session: sessionData,
//  authStrategy: new LocalAuth(
//    {
//      dataPath: './sessions/',
//      clientId: 'fabian'
//    }
//  ),
//  puppeteer: {
//		args: ['--no-sandbox'],
//	}
//});
//
//client1.initialize();
//
//client1.on('qr', qr => {
//  qrcode.generate(qr, {small: true} );
//})
//
//client1.on('ready', async () => {
//  console.log('WhatsApp Ready');
//  let chatId = `5493624683656@c.us`
//  const send = await client1.sendMessage(chatId,'Hola Firulais');
//  const added = await whatsapp.insertMany([send])
//  if(send.id.fromMe){
//    console.log('El mensaje fue enviado', added);
//  }
//  const contacts = await client1.getContacts();
//  console.log(contacts);
//    //.then( response => {
////
//    //  if(response.id.fromMe){
//    //    console.log('El mensaje fue enviado');
//    //  }
//    //})
//})
//
//client1.on('authenticated', (session) => {
//  sessionData = session;
//  console.log('authenticated', session);
//});
//
//client1.on('auth_failure', err =>  {
//  console.error('Error en Authentication');
//  console.error(err);
//});
//client1.on('message', async message => {
//  console.log(message)
//  await whatsapp.insertMany([message])
//	if(message.body === '!ping') {
//		const test = await message.reply('pong');
//    console.log('!!!!!!!!!!!',test);
//	}
//});


const port = config.app_port || 3000;
const server = http.createServer(app);
const httpServer = server.listen(port, () => console.log('server listening on port ' + port));
const io = new WebSocketServer( httpServer,{
  cors: {
    origin: "*",
  }
} );
app.set('sio',io)
sockets(io);
