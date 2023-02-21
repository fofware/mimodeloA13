import { Schema, model, Document } from "mongoose";

export interface Iapplication extends Document {
  _id: string;              //? no se si usar una generada o Id de la Aplicación
  //client_id: string;        //Id de la Applicación
  client_secret: string;    //Se encuentra en Credenciales de Producción
  account: string;          //Id del Owner en Mercado Pagos

  user_id: string;          //Id del Usuario logueado | Cuenta 
  name: string;
  description: string;
  production: boolean;
  prod: {
    key: string;
    token: string;
  },
  test: {
    key: string;
    token: string;
  }
};

const applicationSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, index: true },
  client_secret: { type: Schema.Types.String, trim: true},
  account: {type: Schema.Types.String, trim: true, index: true},    //Id del Owner en Mercado Pagos
  owner: { type: Schema.Types.String, trim: true},
  name: { type: Schema.Types.String, trim: true},
  description: { type: Schema.Types.String, trim: true},
  production: { type: Schema.Types.Boolean, default: false},
  prod: {
    key: { type: String }, 
    token: { type: String }
  },
  test: {
    key: { type: String }, 
    token: { type: String }
  },
},
{ 
  strict: false,
  timestamps: true,
  versionKey: false
});


applicationSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<Iapplication>('application', applicationSchema);