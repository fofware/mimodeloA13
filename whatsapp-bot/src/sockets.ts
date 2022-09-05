import { Namespace, Socket } from "socket.io";
import phones from "./models/phones";
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

  io.on('connection', async (socket) => {
    console.log("Nueva coneccion");
    if(socket.handshake.query.tocken){
    } else {
      socket.join('no-authorized');
      socket.emit('no-authorized','no-authorized')
    }
    //console.log('query',socket.handshake.query)
    const decodeToken = (token) => {
      if (!token) return {}
      return JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
    }
    const user = decodeToken(socket.handshake.query.token)
    const nameRoom = socket.handshake.query.rooms;
    socket.join(nameRoom);
    console.log(user);
    socket.emit('id');
    let previousId;
    const safeJoin = currentId => {
      socket.leave(previousId);
      socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
      previousId = currentId;
    };
    const setSkt = (socket,user,phone) => {
      // esto hay que remover cuando el token este arreglado
      user.cuenta = !user.cuenta ? 'firulais': user.cuenta;
      socket.data.user = user._id;
      socket.data.parent = user.parent;
      socket.data.cuenta = user.cuenta,
      socket.data.number = phone;
      socket.data.email = user.email;
      socket.data.nickname = user.nickname;
      socket.data.nombre = user.nombre;
      socket.data.apellido = user.apellido;
      socket.data.rooms = [`${user.cuenta}-owner`,`${user.cuenta}-default`]
      socket.data.name = user.name;
      socket.user = user.nickname;
      //if(user.parent === null || user.parent === ''){
      //  socket.join(`${user.cuenta}-owner`)
      // console.log(`hizo el join${user.cuenta}-owner`)

      //}
    }

    socket.on('getPicUrl', async numero => {
      const keys = Object.keys(gateways);
      const pic = await gateways[keys[0]].client.getProfilePicUrl(`${numero}@c.us`);
      socket.emit('picUrl', pic);
    })

    socket.on('registranumero', async (token, numero) => {
      setSkt(socket,decodeToken(token),numero);
//
      const registered:any = await newGateway(socket);
      if (typeof(registered) !== 'string'){
        gateways[numero] = {
          client: storedGateway( socket ),
        }
      }
      registered.destroy()
    });
    socket.on('id', async (token, phone) => {
      setSkt(socket,decodeToken(token),phone);

    })
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

