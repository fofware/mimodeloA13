import app from './app';
import {Server as WebSocketServer} from 'socket.io'
import http from 'http';
import { connectMongodb } from './dbConnect';
import sockets from './sockets';
import config  from './config';

connectMongodb();

import * as fs from 'fs';

const port = config.app_port || 3000;
const server = http.createServer(app);
const httpServer = server.listen(port, () => console.log('server listening on port ' + port));
const io = new WebSocketServer( httpServer,
  {
   cors: {
    origin: "*",
    methods:['GET','POST','PUT','DELETE'],
  }
} );
app.set('sio',io)
sockets(io);
