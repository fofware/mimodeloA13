import { Schema, model, Document } from "mongoose";

export interface IEdades extends Document {
  name: string;
  iconos: [];
  images: [];
};

const edadSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true, unique: true },
  iconos: { type: Schema.Types.Array, default: null},
  images: { type: Schema.Types.Array, default: null}
},
{ 
  strict: false,
  versionKey: false
});


edadSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IEdades>('Edad', edadSchema);