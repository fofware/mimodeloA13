import { Schema, model, Document } from "mongoose";

export interface IFabricante extends Document {
  name: string;
  marcas: [];
  images: [];
};

const fabricanteSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true },      // Gatitos Carne y Leche
  marcas: [{ ref: "Marca", type: Schema.Types.ObjectId, default: [] }],
  images: [{ type: Schema.Types.String, default: null}]
},
{ 
  strict: false,
});


fabricanteSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IFabricante>('Fabricante', fabricanteSchema);