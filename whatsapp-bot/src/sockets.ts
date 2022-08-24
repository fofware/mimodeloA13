import { Namespace, Socket } from "socket.io";
import phones from "./models/phones";
import { WAppClient, WAppRegister } from "./wappgateway";
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
  io.on('connection', async (socket:any) => {
    console.log("Nueva coneccion");
    socket.emit('sendId', socket.id);

    let previousId;
    const safeJoin = currentId => {
      socket.leave(previousId);
      socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
      previousId = currentId;
    };

    socket.on('id', params => {
      //
      //validar id
      //conetar este socket con cada gateway que corresponda al id
      //
      const {token, phone } = params
      const user = JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
      
      console.log('onId',user);
      console.log(phone)
      for (let index = 0; index < phone.length; index++) {
        const p = {
          owner: user._id,
          email: user.email,
          nickname: user.nickname,
          nombre: user.nombre,
          apellido: user.apellido,
          number: phone[index],
          name: user.name
        }
        socket.waClient = WAppClient(socket,p)
      }
      console.log(socket.user);
    })
    socket.on('setData', params => {
      console.log( params );
    });
    socket.on("getDoc", docId => {
      safeJoin(docId);
      socket.emit("document", documents[docId]);
    });
    socket.on(`waRegister`,(params) => {
      socket.waClient = WAppRegister(socket, params)
    })
    socket.on(`waConnect`,(params) => {
      socket.waClient = WAppClient(socket, params)
    })
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

