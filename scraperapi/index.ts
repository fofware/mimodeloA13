import app from './app';
import http from 'http';
import config  from './config';
/*
import {Server as WebSocketServer} from 'socket.io'
import { connectMongodb } from './dbConnect';
import sockets from './sockets';

connectMongodb();
*/
const port = config.app_port || 3000;
const server = http.createServer(app);
const httpServer = server.listen(port, () => console.log('server listening on port ' + port));
/*
const io = new WebSocketServer( httpServer,{
  //cors: {
  //  origin: "*",
  //}
} );
app.set('sio',io)
sockets(io);
*/