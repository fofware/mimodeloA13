import { Schema, model, Document } from "mongoose";

export interface IEspecies extends Document {
  name: string;
  iconos: [];
  images: [];
};

const especieSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true },      // Gatitos Carne y Leche
  iconos: [{ type: Schema.Types.String, default: null}],
  images: [{ type: Schema.Types.String, default: null}]
},
{ 
  strict: false,
});


especieSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IEspecies>('Especie', especieSchema);