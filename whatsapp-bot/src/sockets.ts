import { Socket } from "socket.io";
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
    let previousId;

    const safeJoin = currentId => {
      socket.leave(previousId);
      socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
      previousId = currentId;
    };

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
  
    /*
    socket.onAny((eventName:string, ...args: any) => {
      console.log(eventName);
      console.log(args);
    });
    */
  });
}

