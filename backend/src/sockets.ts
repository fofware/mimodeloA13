import { Server, Socket } from "socket.io";
import user from "./models/user";
import jwt from 'jsonwebtoken';
import config from './config';


//import articulo from "./models/articulos";
//import producto from "./models/producto";
//import { productoGetData } from "./controlers/productoControler";

const add = async (data:any, socket:any, dbData:any, msg:any) => {
  let respta = [];
  console.log("add_inicia");
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    const filter = { 
      _id: e._id,
    };

    let ret = await dbData.findOneAndUpdate(filter, e, {
      new: true,
      upsert: true,
      rawResult: true // Return the raw result from the MongoDB driver
    });

    ret.value instanceof user; // true
    // The below property will be `false` if MongoDB upserted a new
    // document, and `true` if MongoDB updated an existing object.
    ret.lastErrorObject.updatedExisting; // false
    //console.log('precios',ret);
    respta.push(ret)
    if( ( i % 5 ) === 4){
      await socket.emit(`server:${msg}`,respta);
      respta = []    
    }
  }

  console.log("add_responde")
  console.log(dbData);
  await socket.emit(`server:${msg}`,respta);
}

const sendData = async (data:any, socket:any, msg:string) => {
  let respta = [];
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    respta.push(e);
    if( ( i % 10 ) === 9 ){
      await socket.emit(`server:${msg}`,respta);
      respta = [];
    }
  }
  await socket.emit(`server:${msg}`,respta);
}

export const setsockets = (io: Server) => {
  /*
  io.use( async (socket, next) => {
    try {
      const token:any = socket.handshake.query.token;
      const payload = jwt.verify( token, config.jwtSecret);
      console.log(payload);
      next;
    } catch (error) {
      console.log('fallo la Athentication')
      console.log(error)
    }
  })
  */
  io.on('connection', async (socket:Socket) => {
    console.log('---------- Socket.Id -----------')
    console.log(socket.id)
    try {
      if(socket.handshake.query && socket.handshake.query.token){
        const token:any = socket.handshake.query.token;
        const payload = jwt.verify( token, config.jwtSecret);
        console.log(payload);
      }
    } catch (error) {
      console.log("ERROR NO TOCKEN PROVIDED")      
    }
    console.log('---------- Socket.Id -----------')
    socket.emit('Hola', 'mundo','apiSrv');

    socket.on('ping', async () => {
      console.log('onping');
      const d = new Date().getTime();
      socket.emit('pong', 'onping', d);
      //io.emit('pong', 'onping');
    });
    
    socket.on('pingtoall', async () => {
      const d = new Date().toISOString()
      io.emit('pongtoall', 'apiSrv', d);
    });

    socket.onAny( (e:any, ...args:any[] ) => {
      console.log('onAny',e);
      console.log( ...args );
      //socket.emit('pong','onAny');
    });
  });

}