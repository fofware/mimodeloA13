import express, { Application, NextFunction, Request, Response, Router } from 'express';
import path from 'path'
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import passportMiddelware from './middlewares/passport';
import config from './config';
import { userCtrl } from './controlers/userController';
import { articuloCtrl } from './controlers/articuloControler';
import { productoCtrl } from './controlers/productoControler';
import { ipnCtrl } from './mp/controlers/ipnControler';
import { WebHooksCtrl } from './mp/controlers/webhooksControler';
import { SucursalesCtrl } from './mp/controlers/sucursalesControler';
import { devCtrl } from './mp/controlers/devControlers';
import { prodNameCtrl } from './controlers/productonameControler';
import authRoutes from './routes/authRoutes';
import { makeCtrl } from './controlers/makeDataControler';
import { importCtrl } from './controlers/importControler';
import { presentacionCtrl } from './controlers/presentacionesControlers';
import { proveedorCtrl } from './controlers/proveedorControler';
import { proveedorProductoCtrl } from './controlers/proveedorProductoControler';
import { MarcaCtrl } from './controlers/marcaControler';
import { FabricanteCtrl } from './controlers/fabricanteControler';

//import { articuloCtrl } from './controlers/articuloControler';
//import { productoCtrl } from './controlers/productoControler';
const app = express();
if(config.public)
  app.use(express.static(path.join(__dirname,config.public)));
app.use(morgan('common'));
const corsOptions = {
  origin: '*',
//  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
passport.use(passportMiddelware);
app.disable('etag');
const router: Router = Router();
app.use(userCtrl.router);
app.use(articuloCtrl.router);
app.use(productoCtrl.router);
app.use(prodNameCtrl.router);
app.use(presentacionCtrl.router);
app.use(ipnCtrl.router);
app.use(WebHooksCtrl.router);
app.use(SucursalesCtrl.router);
app.use(devCtrl.router);
app.use(makeCtrl.router);
app.use(importCtrl.router);
app.use(proveedorCtrl.router);
app.use(proveedorProductoCtrl.router);
app.use(FabricanteCtrl.router);
app.use(MarcaCtrl.router);
app.use(proveedorProductoCtrl.router);
app.use(authRoutes);
export default app;
