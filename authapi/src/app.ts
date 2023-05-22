import express from 'express';
import path from 'path'
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import passportMiddelware from './middlewares/passport';
import config from './config';
import { userCtrl } from './controlers/userController';
import authRoutes from './routes/authRoutes';
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
app.use(userCtrl.router);
app.use(authRoutes);
export default app;
