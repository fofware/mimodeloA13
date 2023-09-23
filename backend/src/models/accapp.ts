import { Schema, model, Document } from "mongoose";

export interface AccApp extends Document {
  account: string;
  app: string;
  role: [];
};

const appSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true, unique: true },
  icons: { type: Schema.Types.Array, default: null},
  images: { type: Schema.Types.Array, default: null}
},
{ 
  strict: false,
  versionKey: false
});


appSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<AccApp>('AccApp', appSchema);