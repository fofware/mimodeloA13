import express, { Router } from 'express';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import passportMiddelware from './middlewares/passport';
import config from './config';
import { ipnCtrl } from './controlers/ipnControlers';
import { devCtrl } from './controlers/devControlers';
import { SucursalesCtrl } from './controlers/sucursalesControlers';
import { accountCtrl } from './controlers/accountControlers';

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
  res.set('Content-Type', fr.mimetype);
  res.set('Content-Length', fr.data.length);
  const buffer = Buffer.from(fr.data, 'base64');
  res.send(buffer);
});

app.use(ipnCtrl.router);
app.use(devCtrl.router);
app.use(SucursalesCtrl.router);
app.use(accountCtrl.router)

app.use(router);

app.disable('etag');

export default app;
