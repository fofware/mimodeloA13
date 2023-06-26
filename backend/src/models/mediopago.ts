import { Schema, model, Document } from "mongoose";

export interface MedioPago extends Document {
  account: string;
  name: string;
};

const medioPagoSchema = new Schema({
  account: {type: Schema.Types.ObjectId, ref: 'Accounts' },
  name: { type: Schema.Types.String, trim: true, default: '', index: true, unique: true },
},
{ 
  strict: false,
  versionKey: false
});

medioPagoSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<MedioPago>('mediopago', medioPagoSchema);