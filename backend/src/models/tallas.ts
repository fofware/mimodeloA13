import { Schema, model, Document } from "mongoose";

export interface ITalla extends Document {
  name: string;
  icons: [];
  images: [];
};

const tallaSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true, unique: true },
  icons: { type: Schema.Types.Array, default: null},
  images: { type: Schema.Types.Array, default: null}
},
{ 
  strict: false,
  versionKey: false
});


tallaSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<ITalla>('Talla', tallaSchema);