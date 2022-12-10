import { Schema, model, Document } from "mongoose";

export interface IFabricante extends Document {
  name: string;
  images: [];
};

export const fabricanteSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true },      // Gatitos Carne y Leche
  images: [{ type: Schema.Types.String, default: null}]
},
{ 
  strict: false,
  versionKey: false
});


fabricanteSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IFabricante>('Fabricante', fabricanteSchema);