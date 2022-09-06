import { Namespace, Socket } from "socket.io";
import phones from "./models/phones";
import fs from 'fs';

import { gateways, newGateway, storedGateway } from "./wappgateway";
//import user from "./models/user";
//import articulo from "./models/articulos";
//import producto from "./models/producto";
//import { productoGetData } from "./controlers/productoControler";

//const add = async (data:any, socket:any, dbData:any, msg:any) => {
//  let respta = [];
//  console.log("add_inicia");
//  for (let i = 0; i < data.length; i++) {
//    const e = data[i];
//    const filter = { 
//      _id: e._id,
//    };
//
//    let ret = await dbData.findOneAndUpdate(filter, e, {
//      new: true,
//      upsert: true,
//      rawResult: true // Return the raw result from the MongoDB driver
//    });
//
//    ret.value instanceof user; // true
//    // The below property will be `false` if MongoDB upserted a new
//    // document, and `true` if MongoDB updated an existing object.
//    ret.lastErrorObject.updatedExisting; // false
//    //console.log('precios',ret);
//    respta.push(ret)
//    if( ( i % 5 ) === 4){
//      await socket.emit(`server:${msg}`,respta);
//      respta = []    
//    }
//  }
//
//  console.log("add_responde")
//  console.log(dbData);
//  await socket.emit(`server:${msg}`,respta);
//}

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

export default (io:any) => {
  const documents = {};
  const decodeToken = (token) => {
    if (!token) return {}
    return JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')));
  }

  const setSkt = (socket,user) => {
    socket.data.user = user._id;
    socket.data.parent = user.parent;
    socket.data.email = user.email;
    socket.data.nickname = user.nickname;
    socket.data.nombre = user.nombre;
    socket.data.apellido = user.apellido;
    socket.data.rooms = [`${user._id}`]
    socket.data.name = user.name;
    socket.user = user.nickname;
    socket.join(`${user._id}`)
  }

  io.on('connection', async (socket) => {
    console.log("Nueva coneccion");
    if(socket.handshake.query.token){
      const user = decodeToken(socket.handshake.query.token)
      setSkt(socket,user)
      console.log("socket.data");
      console.log(socket.data);
    } else {
      socket.join('no-authorized');
      socket.emit('no-authorized','no-authorized')
      return
    }

    //console.log('query',socket.handshake.query)

    /*
    socket.on('getPicUrl', async numero => {
      const keys = Object.keys(gateways);
      const pic = await gateways[keys[0]].client.getProfilePicUrl(`${numero}@c.us`);
      socket.emit('picUrl', pic);
    })
    */
    
    socket.on('registranumero', async (token) => {
      console.log('************ Registra Celular ************')
      console.log(socket.data);
      const registered:any = await storedGateway(socket.data);
      if (typeof(registered) !== 'string'){
        const phone = registered.info.wid.user;
        socket.data.phone = phone;
        console.log(socket.data)
        console.log(fs.readdirSync('./'))
        fs.rmSync(`./sessions/session-${socket.data.user}_${phone}`, { recursive: true, force: true });
        fs.renameSync(`./sessions/session-${socket.data.user}`,`./sessions/session-${socket.data.user}_${phone}`)
        fs.rmSync(`./sessions/session-${socket.data.user}`, { recursive: true, force: true });
        await phones.findOneAndUpdate({user: socket.data.user, phone: socket.data.phone},
          socket.data,
          {
            new: true,
            upsert: true,
            rawResult: true // Return the raw result from the MongoDB driver
          }
        );
      }
    });
    /*
    socket.on('id', async (token, phone) => {
      setSkt(socket,decodeToken(token),phone);

    })
    */

    let previousId;
    const safeJoin = currentId => {
      socket.leave(previousId);
      socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
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

