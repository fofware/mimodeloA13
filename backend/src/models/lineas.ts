import { Schema, model, Document } from "mongoose";

export interface ILinea extends Document {
  name: string;
  rubro: object;
  icons:[];
  images: [];
};

const lineaSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true, unique: true },
  rubro: { ref: "Rubro", type: Schema.Types.ObjectId, default: null },
  icons: { type: Schema.Types.Array, default: null},
  images: { type: Schema.Types.Array, default: null}
},
{ 
  strict: false,
  versionKey: false
});


lineaSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<ILinea>('Linea', lineaSchema);