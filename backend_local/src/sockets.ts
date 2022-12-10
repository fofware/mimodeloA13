import { Socket } from "socket.io";
import user from "./models/user";
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

export default (io:any) => {
  io.on('connection', async (socket:any) => {
    console.log("Nueva coneccion");
    //console.log(socket);
    //const userList = await user.find();
    //const articuloList = await articulo.find();
    //const productoList = await producto.find();
    //await socket.emit('server:producto', productoList);

		//const readData: any = await productoGetData({});
    //console.log("leyo");
    //socket.emit('server:userList', userList);
    //socket.emit('server:articulo', articuloList);

    socket.onAny((eventName:string, ...args: any) => {
      console.log(eventName);
      console.log(args);
    });
  });
}