import app from './app';
import {Server as WebSocketServer} from 'socket.io'
import http from 'http';
import { connectMongodb, atlasData, authData, wappData, atlasWhatsApp, masterData, gestionData } from './dbConnect';
import sockets from './sockets';
import config  from './config';

import { Schema } from "mongoose";

import { userSchema } from './models/user';
import { MessageSchema } from './models/whatsapp/messages';
import { WappPhoneSchema } from './models/whatsapp/phones';
import { ipnCtrl } from './mp/controlers/ipnControler';
import { WappContactsSchema } from './models/whatsapp/contacts'
import { WappRouteSchema } from './models/whatsapp/routes';
import { articuloSchema } from './models/master/articulos';
import { edadSchema } from './models/master/edades';
import { especieSchema } from './models/master/especies';
import { extradataSchema } from './models/master/extradata';
import { fabricanteSchema } from './models/master/fabricantes';
import { lineaSchema } from './models/master/lineas';
import { marcaSchema } from './models/master/marcas';
import { rubroSchema } from './models/master/rubros';
import { tallaSchema } from './models/master/tallas';
import { presentacionSchema } from './models/master/presentaciones';
import { productoNameSchema } from './models/master/productoname';
import { precioSchema } from './models/precio';
import { proveedorSchema } from './models/proveedores';
import { proveedorProductoSchema } from './models/proveedorProductos';

interface itrasnfer {
  sourceConn: any,
  sourceFile: string, 
  sourceSchema: Schema,
  targetConn: any,
  targetFile: string,
  targetSchema: Schema,
  offset?: number
}

const transferir = async (params:itrasnfer) =>  {
  const sourceData = params.sourceConn.model(params.sourceFile, params.sourceSchema);
  const targetData = params.targetConn.model(params.targetFile, params.targetSchema);

  const count = await sourceData.count();
  let offset = params?.offset || 0;
  const limit = 500;
  do {
    const promiseArr = [];
    const data = await sourceData.find().limit(limit).skip(offset)
    for (let index = 0; index < data.length; index++) {
      const reg = data[index];
      const filter = {
        _id: reg._id
      }
      if(reg?.rubro==='') console.log(reg)
      promiseArr.push(
        targetData.findOneAndUpdate(filter,reg,{
          new: true,
          upsert: true
        })
      );
    }
    const ret = await Promise.all(promiseArr);
    offset += data.length;
    console.log(`insert ${offset} de ${count} in ${params.targetFile}`)
  } while (offset < count);
}

connectMongodb();
// Auth
//transferir( { sourceConn: atlasData, sourceFile:'user', sourceSchema: userSchema, targetConn: authData, targetFile: 'user', targetSchema: userSchema } );
// WhatsApp
transferir( { sourceConn: atlasWhatsApp, sourceFile:'messages', sourceSchema: MessageSchema, targetConn: wappData, targetFile: 'messages', targetSchema: MessageSchema, offset: 86000 } );
transferir( { sourceConn: atlasWhatsApp, sourceFile:'phone', sourceSchema: WappPhoneSchema, targetConn: wappData, targetFile: 'phone', targetSchema: WappPhoneSchema } );
transferir( { sourceConn: atlasWhatsApp, sourceFile:'contact', sourceSchema: WappContactsSchema, targetConn: wappData, targetFile: 'contact', targetSchema: WappContactsSchema } );
transferir( { sourceConn: atlasWhatsApp, sourceFile:'mediadata', sourceSchema: WappContactsSchema, targetConn: wappData, targetFile: 'mediadata', targetSchema: WappContactsSchema } );
transferir( { sourceConn: atlasWhatsApp, sourceFile:'routes', sourceSchema: WappRouteSchema, targetConn: wappData, targetFile: 'routes', targetSchema: WappRouteSchema } );
/*
// Master de Articulos
transferir( { sourceConn: atlasData, sourceFile:'articulo', sourceSchema: articuloSchema, targetConn: masterData, targetFile: 'articulo', targetSchema: articuloSchema } );
transferir( { sourceConn: atlasData, sourceFile:'edad', sourceSchema: edadSchema, targetConn: masterData, targetFile: 'edad', targetSchema: edadSchema } );
transferir( { sourceConn: atlasData, sourceFile:'especie', sourceSchema: especieSchema, targetConn: masterData, targetFile: 'especie', targetSchema: especieSchema } );
transferir( { sourceConn: atlasData, sourceFile:'extradata', sourceSchema: extradataSchema, targetConn: masterData, targetFile: 'extradata', targetSchema: extradataSchema } );
transferir( { sourceConn: atlasData, sourceFile:'fabricante', sourceSchema: fabricanteSchema, targetConn: masterData, targetFile: 'fabricante', targetSchema: fabricanteSchema } );
transferir( { sourceConn: atlasData, sourceFile:'linea', sourceSchema: lineaSchema, targetConn: masterData, targetFile: 'linea', targetSchema: lineaSchema } );
transferir( { sourceConn: atlasData, sourceFile:'marca', sourceSchema: marcaSchema, targetConn: masterData, targetFile: 'marca', targetSchema: marcaSchema } );
transferir( { sourceConn: atlasData, sourceFile:'presentacion', sourceSchema: presentacionSchema, targetConn: masterData, targetFile: 'presentacion', targetSchema: presentacionSchema } );
transferir( { sourceConn: atlasData, sourceFile:'productoname', sourceSchema: productoNameSchema, targetConn: masterData, targetFile: 'productoname', targetSchema: productoNameSchema } );
transferir( { sourceConn: atlasData, sourceFile:'rubro', sourceSchema: rubroSchema, targetConn: masterData, targetFile: 'rubro', targetSchema: rubroSchema } );
transferir( { sourceConn: atlasData, sourceFile:'talla', sourceSchema: tallaSchema, targetConn: masterData, targetFile: 'talla', targetSchema: tallaSchema } );
transferir( { sourceConn: atlasData, sourceFile:'precio', sourceSchema: precioSchema, targetConn: masterData, targetFile: 'precio', targetSchema: precioSchema } );
*/
transferir( { sourceConn: atlasData, sourceFile:'user', sourceSchema: userSchema, targetConn: gestionData, targetFile: 'user', targetSchema: userSchema } );
transferir( { sourceConn: atlasData, sourceFile:'articulo', sourceSchema: articuloSchema, targetConn: gestionData, targetFile: 'articulo', targetSchema: articuloSchema } );
transferir( { sourceConn: atlasData, sourceFile:'edad', sourceSchema: edadSchema, targetConn: gestionData, targetFile: 'edad', targetSchema: edadSchema } );
transferir( { sourceConn: atlasData, sourceFile:'especie', sourceSchema: especieSchema, targetConn: gestionData, targetFile: 'especie', targetSchema: especieSchema } );
transferir( { sourceConn: atlasData, sourceFile:'extradata', sourceSchema: extradataSchema, targetConn: gestionData, targetFile: 'extradata', targetSchema: extradataSchema } );
transferir( { sourceConn: atlasData, sourceFile:'fabricante', sourceSchema: fabricanteSchema, targetConn: gestionData, targetFile: 'fabricante', targetSchema: fabricanteSchema } );
transferir( { sourceConn: atlasData, sourceFile:'linea', sourceSchema: lineaSchema, targetConn: gestionData, targetFile: 'linea', targetSchema: lineaSchema } );
transferir( { sourceConn: atlasData, sourceFile:'marca', sourceSchema: marcaSchema, targetConn: gestionData, targetFile: 'marca', targetSchema: marcaSchema } );
transferir( { sourceConn: atlasData, sourceFile:'presentacion', sourceSchema: presentacionSchema, targetConn: gestionData, targetFile: 'presentacion', targetSchema: presentacionSchema } );
transferir( { sourceConn: atlasData, sourceFile:'productoname', sourceSchema: productoNameSchema, targetConn: gestionData, targetFile: 'productoname', targetSchema: productoNameSchema } );
transferir( { sourceConn: atlasData, sourceFile:'rubro', sourceSchema: rubroSchema, targetConn: gestionData, targetFile: 'rubro', targetSchema: rubroSchema } );
transferir( { sourceConn: atlasData, sourceFile:'talla', sourceSchema: tallaSchema, targetConn: gestionData, targetFile: 'talla', targetSchema: tallaSchema } );
transferir( { sourceConn: atlasData, sourceFile:'precio', sourceSchema: precioSchema, targetConn: gestionData, targetFile: 'precio', targetSchema: precioSchema } );
transferir( { sourceConn: atlasData, sourceFile:'proveedor', sourceSchema: proveedorSchema, targetConn: gestionData, targetFile: 'proveedor', targetSchema: proveedorSchema } );
transferir( { sourceConn: atlasData, sourceFile:'proveedorproducto', sourceSchema: proveedorProductoSchema, targetConn: gestionData, targetFile: 'proveedorproducto', targetSchema: proveedorProductoSchema } );


const port = config.app_port || 3000;
const server = http.createServer(app);
const httpServer = server.listen(port, () => console.log('server listening on port ' + port));
const io = new WebSocketServer( httpServer,
  {
    cors: {
      origin: "*",
    }
  }
);

app.set('sio',io)
sockets(io);

