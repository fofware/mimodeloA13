import config from "./config";
import { connect, ConnectOptions } from "mongoose";
import mongoose from 'mongoose';

export const connectMongodb = async () => {
  const mongoDBoptions: ConnectOptions ={
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useFindAndModify: false,
    //useCreateIndex: true
  }
  try {
    await connect(config.mongoDB.URI, mongoDBoptions);
    console.log("MongodbAtlas Conectado")
  } catch (error) {
    console.log("al intentar conectar Mongodb");    
    console.log(config.mongoDB.URI)
    console.log(error)
  }  
}

export const atlasData = mongoose.createConnection(config.mongoDB.URI);
export const atlasWhatsApp = mongoose.createConnection('mongodb+srv://fabian:tamara01@cluster0.wk2fd.mongodb.net/whatsapp?retryWrites=true&w=majority');
export const authData = mongoose.createConnection('mongodb://mongo/auth');
export const wappData = mongoose.createConnection('mongodb://mongo/whatsapp');
export const masterData = mongoose.createConnection('mongodb://mongo/masterDB');
export const gestionData = mongoose.createConnection('mongodb://mongo/gestion');
