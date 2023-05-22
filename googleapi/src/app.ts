import express, { Application, NextFunction, Request, Response, Router } from 'express';
import path from 'path'
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import passportMiddelware from './middlewares/passport';
import config from './config';
import { spreadSheet } from './spreadsheets';


const doc_id1 = '1di4PoB5bOChCUEWBebrXEL2uoygUe15IIZG74GKRQ_I';
const doc_id = '18exawIZFM2huH0wCp0Nk2NNNE_cwbWFMe2VlVhjA1ZY';
const hoja1 = 'Movimientos'
const hoja = 'Fijos'
const hoja2 = 'test'
const app = express();
if(config.public)
  app.use(express.static(path.join(__dirname,config.public)));
app.use(morgan('common'));
const corsOptions = {
  origin: '*',
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
passport.use(passportMiddelware);
app.disable('etag');
const router: Router = Router();
app.get('/', async (req, res) =>{
  const pepe = await spreadSheet.init('credentials.json', doc_id)
  const rows = await pepe.read(hoja2);
  console.log(rows);  

  res.status(200).json(rows)  
})
app.get('/add', async (req:Request, res:Response) =>{
  const pepe = await spreadSheet.init('credentials.json', doc_id)
  /*
  
  let values:(string[])[] = [
    [`${Math.floor(Math.random() * (max - min) + min)}`,`${Math.floor(Math.random() * (max - min) + min)}`,`=a${idx}+b${idx}`],
  ];
  */

  const rows = await pepe.append(hoja2, []);
//  console.log(rows);  

  res.status(200).json(rows)  
})
export default app;
