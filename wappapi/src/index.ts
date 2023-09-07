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

//import * as qrcode from 'qrcode-terminal';
import * as fs from 'fs';

const port = config.app_port || 3000;
const server = http.createServer(app);
const httpServer = server.listen(port, () => console.log('server listening on port ' + port));
const io = new WebSocketServer( httpServer, {
  cors: {
    origin: '*',
    methods:['GET','POST','PUT','DELETE'],
  }
});
app.set('sio',io)
sockets(io);
