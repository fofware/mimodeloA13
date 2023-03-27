/**
 * https://www.digitalocean.com/community/tutorials/angular-socket-io
 * https://www.tutorialspoint.com/socket.io/socket.io_error_handling.htm
 * https://socket.io/docs/v3/emit-cheatsheet/
 * https://www.tutsmake.com/node-js-express-socket-io-chat-application-example/
 * 
 **/ 
import express, { Application, NextFunction, Request, response, Response, Router } from 'express';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import passportMiddelware from './middlewares/passport';
import config from './config';
import { initAllWapp } from './wappgateway';
import phones from './models/phones';
import { importCtrl } from './controlers/importControler';
import whatsapp from './models/whatsapp';
import contacts from './models/contacts';
import { WAG_Clients } from './wapplib';


//import { articuloCtrl } from './controlers/articuloControler';
//import { productoCtrl } from './controlers/productoControler';
const app = express();
const router:Router = Router();

if(config.public)
  app.use(express.static(path.join(__dirname,config.public)));
app.use('/media',express.static(path.join(__dirname,'/../mediaReceive')))
app.use(morgan('common'));


app.use(cors());

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
app.use(passport.initialize());
passport.use(passportMiddelware);
/**
 * Rutas
 */
router.get('/', (req, res) => {
  res.sendFile(__dirname + '/../html/index.html');
});

router.get('/media/:file', (req, res) => {
  const f = req.params.file
  const fr:any = JSON.parse(fs.readFileSync(`${__dirname}/../mediaReceive/${f}.json`,{encoding: 'utf8', flag: 'r'}));
  /*
  console.log(fr);
  console.log(fr.mimetype);
  console.log(fr.data);
  */
  res.set('Content-Type', fr.mimetype);
  res.set('Content-Length', fr.data.length);
  const buffer = Buffer.from(fr.data, 'base64');
  res.send(buffer);
});

router.get('/phones', async (req:Request, res:Response) => {
  const pl = await phones.find();
  res.status(200).json(pl);
})

router.get('/phones/:id', async (req:Request, res:Response) => {
  const id = req.params.id;
  const pl = await phones.find({user: id});
  res.status(200).json(pl);
})
router.get(`/messages/:num`, async (req, res) =>{
  const {num} = req.params
  try {
    const messages = await whatsapp.find({$or:[{from: `${num}@c.us`},{to: `${num}@c.us`}]}).sort({ timestamp: -1}).limit(200)
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json('Phone not found')    
  }
});
router.get(`/estados/:num`, async (req, res) =>{
  const {num} = req.params
  try {
    const messages = await whatsapp.find({from: `status@broadcast`, to: `${num}@c.us`}).sort({ timestamp: -1}).limit(200)
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json('Phone not found')    
  }
});
router.get(`/chat/:num/:to`, async (req, res) =>{
  const {num, to} = req.params
  try {
    const messages = await whatsapp.find(
      {
        $or:[
          {from: `${num}@c.us`, to: `${to}@c.us`},
          {from: `${to}@c.us`, to:`${num}@c.us`}
        ]
      }
    ).sort({ timestamp: -1}).limit(200)
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json('Phone not found')    
  }
});
router.get(`/contacts/:num`, async (req, res) =>{
  const {num} = req.params;
  const {client} = WAG_Clients[num];
  if(client){
    const rcontactos = await client.getContacts();
    const datArray = []
    const contactos = rcontactos.filter(c => c.id.server !== 'lid');
    contactos.map( async c => {
      datArray.push(c.getAbout());
      datArray.push(c.getChat());
      datArray.push(c.getProfilePicUrl());
      datArray.push(c.getFormattedNumber());
      datArray.push(c.getCommonGroups());
    })
    const results = await Promise.all(datArray)
    //console.log(results);
    let i = 0;
    /*
    contactos.map(c => {
      c['chat'] = results[0+i];
      c['picUrl'] = results[1+i];
      c['fNumber'] = results[2+i];
      c['cGroups'] = results[3+i];
      i+=4;
    })
    */
    contactos.map(c => {
      c['about'] = results[0+i];
      c['chat'] = results[1+i];
      c['picUrl'] = results[2+i];
      c['fNumber'] = results[3+i];
      c['cGroups'] = results[4+i];
      i+=5;
    })
    const tosave = [];
    /*
    contactos.map( c => {
      const filter = {
        from: client.info.wid.user,
        phone: c.id.user
      }
      const reg = Object.assign({}, filter, c);
      tosave.push(contacts.findOneAndUpdate(filter,reg,{
        new: true,
        upsert: true
      }))
    })
    const ret = await Promise.all(tosave);
    */
    res.status(200).json(contactos);
  }
/*
  try {
    const messages = await contacts.find(
      {from: `${num}`}
    ).sort({ timestamp: -1})//.limit(500)
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json('Phone not found')    
  }
*/
});

router.get(`/test/:num`, async (req, res) =>{
  const {num} = req.params
  const {client} = WAG_Clients[num];
  try {
    const messages = await client.getChats();
    res.status(200).json(messages);
  } catch (error) {
    res.status(404).json('Phone not found')    
  }
});

app.use(importCtrl.router);
app.use(router);
app.disable('etag');
initAllWapp(app)

export default app;
