import { Schema, model, Document } from "mongoose";
import pictures from "./pictures";

export interface Vehiculo extends Document {
  dominio: string;
  year: number;
  marca: string;
  modelo: string;
  tipo: string;
  uso: string;
  chasis: string;
  motor: string;
  pictures: []
};

const vehiculoSchema = new Schema({
  dominio: { type: Schema.Types.String, index: true },
  year: { type: Schema.Types.Number},
  marca: { type: Schema.Types.String },
  modelo: { type: Schema.Types.Date },
  tipo: { type: Schema.Types.String },
  uso: { type: Schema.Types.String},
  chasis: { type: Schema.Types.String},
  motor: { type: Schema.Types.String},
  pictures: { ref: "Picture", type: Schema.Types.ObjectId, default: null },
},
{ 
  strict: false,
  versionKey: false
});


vehiculoSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<Vehiculo>('Vehiculo', vehiculoSchema);
