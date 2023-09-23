import { Schema, model, Document } from "mongoose";

export interface App extends Document {
  name: string;
  icons:[];
  images: [];
};

const appSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true, unique: true },
  uri: { type: Schema.Types.String, trim: true}
},
{ 
  strict: false,
  versionKey: false
});


appSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<App>('App', appSchema);