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
//import passport from 'passport';
//import passportMiddelware from './middlewares/passport';
import config from './config';
import { WAppClient, WAppGateway } from './wappgateway';
import wappphone  from './models/phones';

const initPhones = async () => {
  const phones = await wappphone.find()
  for (let i = 0; i < phones.length; i++) {
    const p = phones[i];
    console.log(p)
    //WAppClient(p)
  }
}

/*
const getQr = (req, res) => {
  res.writeHead(200, { 'content-type': 'image/svg+xml' });
  fs.createReadStream(`${__dirname}/../mediaSend/qr-code.svg`).pipe(res.send);
}
*/

//import { articuloCtrl } from './controlers/articuloControler';
//import { productoCtrl } from './controlers/productoControler';
const app = express();
if(config.public)
  app.use(express.static(path.join(__dirname,config.public)));
app.use(morgan('common'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(passport.initialize());
//passport.use(passportMiddelware);
app.disable('etag');
const router: Router = Router();
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../html/index.html');
});
app.use(router);
//initPhones()
export default app;
