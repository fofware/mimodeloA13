import { Schema, model, Document } from "mongoose";

export interface IRazas extends Document {
  name: string;
  iconos: [];
  images: [];
};

const razaSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true },      // Gatitos Carne y Leche
  iconos: [{ type: Schema.Types.String, default: null}],
  images: [{ type: Schema.Types.String, default: null}]
},
{ 
  strict: false,
  versionKey: false
});


razaSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IRazas>('Raza', razaSchema);