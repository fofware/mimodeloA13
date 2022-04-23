import express, { Application, NextFunction, Request, Response, Router } from 'express';
import path from 'path'
import morgan from 'morgan';
import cors from 'cors';
import config from './config';
//import { articuloCtrl } from './controlers/articuloControler';
//import { productoCtrl } from './controlers/productoControler';
const app = express();
if(config.public)
  app.use(express.static(path.join(__dirname,config.public)));
app.use(morgan('common'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable('etag');
const router: Router = Router();
//app.use(articuloCtrl.router);
//app.use(productoCtrl.router);
export default app;
