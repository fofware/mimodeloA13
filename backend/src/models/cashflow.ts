import { Schema, model, Document } from "mongoose";

export interface IGastos extends Document {
  fch_operacion: string;
  name: string;
  rubro: object;
  icons:[];
  images: [];
};

const GastosSchema = new Schema({
  
  fch_operacion: {type: Schema.Types.Date},
  fch_inputacion: { types: Schema.Types.Date},
  fch_vencimiento: { types: Schema.Types.Date },
  fch_pago: { types: Schema.Types.Date },
  importe: { types: Schema.Types.Number },
  pagos: [{
    types: Schema.Types.ObjectId, 
    ref: 'pagos'
  }],
  descripcion: { types: Schema.Types.String},
},
{ 
  strict: false,
  versionKey: false
});

GastosSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IGastos>('Gastos', GastosSchema);