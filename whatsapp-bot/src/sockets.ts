import { Namespace, Socket } from "socket.io";
import phones from "./models/phones";
import { Client } from 'whatsapp-web.js';
import fs from 'fs';

import { newGateway, storedGateway } from "./wappgateway";

export default (io:any) => {
  const documents = {};
  const decodeToken = (token) => {
    if (!token) return {}
    return JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')));
  }

  const setSkt = (socket:Socket,user) => {
    socket.data.user = user._id;
    socket.data.parent = user.parent;
    socket.data.email = user.email;
    socket.data.nickname = user.nickname;
    socket.data.nombre = user.nombre;
    socket.data.apellido = user.apellido;
    socket.data.rooms = [`${user._id}`]
    socket.data.name = user.name;
    socket.data.sktId = socket.id;
    socket.join(`${user._id}`)
  }

  io.on('connection', async (socket:Socket) => {
    console.log("Nueva coneccion");
    if(socket.handshake.query.token){
      const user = decodeToken(socket.handshake.query.token);
      setSkt(socket,user);

    } else {
      socket.join('no-authorized');
      socket.emit('no-authorized','no-authorized')
      return
    }


    socket.on('registranumero', async (token) => {
      console.log('************ Registra Celular ************')
      //console.log(socket.data);
      const registered:Client = await newGateway(socket);
      if (registered){
        const phoneExist = await phones.findOne({phone: registered.info.wid.user})
        //console.log(phoneExist)
        
        if (phoneExist){
          socket.emit('error', `El número ${registered.info.wid.user} ya está registrado en el sistema`)
          registered.destroy();
        } else {
          const dataPath = registered['authStrategy']?.dataPath;
          socket.data.phone = registered.info.wid.user;
          const oldDir = `/session-${socket.data.user}`;
          const newDir = `/session-${socket.data.user}_${socket.data.phone}`;
          fs.renameSync(`${dataPath}${oldDir}`,`${dataPath}${newDir}`);
          socket.data.activo = true;
          const filter = {
            phone: socket.data.phone,
            user: socket.data.user
          }
          const data = {
            phone: socket.data.phone,
            user: socket.data.user,
            rooms: socket.data.rooms,
            activo: true
          }
          let ret = await phones.findOneAndUpdate({ number: socket.data.phone, user: socket.data.user },   // Query parameter
            socket.data, 
            {
              new: true,
              upsert: true,
              rawResult: true // Return the raw result from the MongoDB driver
            });

          ret.value instanceof phones; // true
          // The below property will be `false` if MongoDB upserted a new
          // document, and `true` if MongoDB updated an existing object.
          ret.lastErrorObject.updatedExisting; // false
          console.log(ret);
          console.log(`Debe borrar: ${dataPath}${oldDir}`)
          fs.rmSync(`${dataPath}${oldDir}`, { recursive: true, force: true });
          await registered.destroy();
          await storedGateway(socket.data);
        }

      }
    });

    socket.on('authorizenumero', async (token) => {
      console.log('************ Registra Celular ************')
      console.log(socket.data);
      socket.data.registranumero = true;
      const registered:any = await storedGateway(socket.data);
            
    });
    socket.on('getChats', async () => {
      console.log(socket.data);
    })
    /**
     * esto es para un chat de demo
     */

    let previousId;
    const safeJoin = async currentId => {
      socket.leave(previousId);
      await socket.join(currentId);
      console.log(`Socket ${socket.id} joined room ${currentId}`);
      previousId = currentId;
    };
    socket.on('setData', params => {
      console.log( params );
    });
    socket.on("getDoc", docId => {
      safeJoin(docId);
      socket.emit("document", documents[docId]);
    });
    socket.on("addDoc", doc => {
      documents[doc.id] = doc;
      safeJoin(doc.id);
      io.emit("documents", Object.keys(documents));
      socket.emit("document", doc);
    });

    socket.on("editDoc", doc => {
      documents[doc.id] = doc;
      socket.to(doc.id).emit("document", doc);
    });
    console.log(Object.keys(documents))
    io.emit("documents", Object.keys(documents));

    console.log(`Socket ${socket.id} has connected`);
  
    socket.onAny((eventName:string, ...args: any) => {
      console.log(`eventName:${eventName}`,args);
    });
    
  });
}

