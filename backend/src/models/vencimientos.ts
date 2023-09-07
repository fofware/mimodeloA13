import { Schema, model, Document } from "mongoose";

export interface Vencimiento extends Document {
  empresa: string;
  comprobante: string;
  vence: string;
  detalle: string;
  importe: number;
  estado: string;
};

const vencimientoSchema = new Schema({
  empresa: { type: Schema.Types.String },
  comprobante: { type: Schema.Types.String },
  vence: { type: Schema.Types.Date },
  detalle: { type: Schema.Types.String },
  importe: { type: Schema.Types.Number},
  estado: { type: Schema.Types.String},
},
{ 
  strict: false,
  versionKey: false
});


vencimientoSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<Vencimiento>('Vencimiento', vencimientoSchema);