import { Schema, model, Document } from "mongoose";

export interface IGastos extends Document {
  banco: string;
  empresa: string;
  numero: object;
};

const GastosSchema = new Schema({
  banco: { type: Schema.Types.String, trim:true, index: true, unique: true},
  empresa: { type: Schema.Types.String, trim:true, index: true},
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