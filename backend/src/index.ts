import app from './app';
import {Server as WebSocketServer} from 'socket.io'
import http from 'http';
import { connectMongodb } from './dbConnect';
import {setsockets} from './sockets';
import config  from './config';
import { NextFunction } from 'express';

connectMongodb();
const port = config.app_port || 3000;
/*
const server = http.createServer(app);
//const httpServer = server.listen(port, () => console.log('server listening on port ' + port));
const io = new WebSocketServer( server,{
  cors: {
    origin: "*",
  }
} );
server.listen(port, () => console.log('server listening on port ' + port));
app.set('sio',io)
sockets(io);
*/
const server = http.createServer(app);
const httpServer = server.listen(port, () => console.log('server listening on port ' + port));
const io = new WebSocketServer( httpServer,
  {
   cors: {
    origin: "*",
    methods:['GET','POST','PUT','DELETE'],
  }
} );
setsockets(io);
app.set('sio',io)
