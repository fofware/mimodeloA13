import { Schema, model, Document } from "mongoose";

export interface IRubro extends Document {
  name: string;
  images: [];
};

export const rubroSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true },      // Gatitos Carne y Leche
  images: [{ type: Schema.Types.String, default: null}]
},
{ 
  strict: false,
  versionKey: false
});


rubroSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IRubro>('Rubro', rubroSchema);