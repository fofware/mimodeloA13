import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcrypt"

export interface Account extends Document {
  name: string;
  owner: string;
  empresa: string;
  numero: object;
};

const AccountSchema = new Schema({
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


AccountSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<Account>('Account', AccountSchema);