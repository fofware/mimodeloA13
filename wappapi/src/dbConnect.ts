import config from "./config";
import { connect, ConnectOptions } from "mongoose";

export const connectMongodb = async () => {
  const mongoDBoptions: ConnectOptions ={
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useFindAndModify: false,
    //useCreateIndex: true
  }
  try {
    const db = await connect(config.mongoDB.URI, mongoDBoptions);
    console.log("Mongodb Conectado to ", db.connection.host )    
  } catch (error) {
    console.log("al intentar conectar Mongodb");    
    console.log(config.mongoDB.URI)
    console.log(error)
  }  
}