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

app.use(importCtrl.router);
app.use(router);
app.disable('etag');
initAllWapp(app)

export default app;
