import { Schema, model, Document } from "mongoose";

export interface IModelo extends Document {
  name: string;
  icons: [];
  images: [];
};

const modeloSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true, unique: true },
  icons: { type: Schema.Types.Array, default: null},
  images: { type: Schema.Types.Array, default: null}
},
{ 
  strict: false,
  versionKey: false
});


modeloSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IModelo>('Modelo', modeloSchema);