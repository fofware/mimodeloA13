import { Schema, model, Document } from "mongoose";

export interface IMarca extends Document {
  name: string;
  marcas: object;
  images: [];
};

const marcaSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true },
  fabricante: [{ ref: "Fabricante", type: Schema.Types.ObjectId, default: null }],
  images: [{ type: Schema.Types.String, default: null}]
},
{ 
  strict: false,
});


marcaSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IMarca>('Marca', marcaSchema);