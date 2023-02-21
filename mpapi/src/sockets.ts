import { Socket } from "socket.io";
import fs from 'fs';
import config from "./config";
import jwt from "jsonwebtoken";


export default (io:any) => {
  const documents = {};
  const decodeToken = (token:string) => {
    if (!token) return {}
    return JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')));
  }

  const setSkt = (socket:Socket,user:any) => {
    socket.data.user = user._id;
    socket.data.parent = user.parent;
    socket.data.email = user.email;
    socket.data.nickname = user.nickname;
    socket.data.nombre = user.nombre;
    socket.data.apellido = user.apellido;
    socket.data.rooms = [`${user._id}`];
    socket.data.name = user.name;
    socket.data.sktId = socket.id;
//    socket.join(`${user._id}`)
    socket.data.previus = `${user._id}`;
  }
/**
 * Tengo que aprender como usar esto
 *  
 */
//  io.use( async (socket, next) => {
//    try {
//      if (socket.handshake.query && socket.handshake.query.token){
//        const token:any = socket.handshake.query.token;
//        const payload = jwt.verify( token, config.jwtSecret);
//        socket.decode = payload;
////        setSkt(socket,payload);
//        socket.emit('enuse',`Algo ${socket.id}`)
//        console.log('--------------------------------------------------------')
//        console.log(socket.id)
//        console.log(socket.decode);
//        console.log('--------------------------------------------------------')
//  
//      }      
//
//    } catch (error) {
//      console.log('--------------------------------------------------------')
//      console.log('fallo la Athentication')
//      console.log(error)
//      console.log('--------------------------------------------------------')
//    }
//  })

  io.on('connection', async (socket:Socket) => {
    console.log("Nueva coneccion");
    if(socket.handshake.query && socket.handshake.query.token){
      //const user = decodeToken(socket.handshake.query.token);
      const token:any = socket.handshake.query.token;
      const payload = jwt.verify( token, config.jwtSecret);
      //socket['decode'] = payload;

      console.log(payload);
      setSkt(socket,payload);
    } else {
      socket.join('no-authorized');
      socket.emit('no-authorized','no-authorized')
      socket.disconnect(true);
      return;
    }
    
    socket.onAny((...args)=>{
      console.warn('-------- onAny ---------');
      console.log(args);
    });
    socket.onAny((eventName:string, ...args: any) => {
      console.log(`eventName:${eventName}`,args);
    });
    socket.on("disconnect", () => {
      console.warn('Desconecto');
    });
    console.log(Object.keys(documents))
    console.log(`Socket ${socket.id} has connected`);
  });
}

