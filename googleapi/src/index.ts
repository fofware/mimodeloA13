
import app from './app';
//import {Server as WebSocketServer} from 'socket.io'
import http from 'http';
//import { connectMongodb } from './dbConnect';
//import sockets from './sockets';
import config  from './config';
import { sheetAuth, testGoogle } from './test_spreadsheet';
import { spreadSheet } from './spreadsheets';
/*
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

//testGoogle('credentials.json', doc_id, hoja);
/*
const algo = async () =>{
  const pepe = await spreadSheet.init('credentials.json', doc_id1)
  const rows = await pepe.read(hoja1);
  console.log(rows);  
}

algo();
*/