import { Schema, model, Document } from "mongoose";

export interface IMedida extends Document {
  name: string;
  iconos: [];
  images: [];
};

const medidaSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true },      // Gatitos Carne y Leche
  iconos: [{ type: Schema.Types.String, default: null}],
  images: [{ type: Schema.Types.String, default: null}]
},
{ 
  strict: false,
  versionKey: false
});


medidaSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IMedida>('medida', medidaSchema);