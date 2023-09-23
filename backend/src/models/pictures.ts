import { Schema, model, Document } from "mongoose";

export interface Picture extends Document {
  name: string;
  description: string;
  width: number;
  height: number;
  url: string;
};

const pictureSchema = new Schema({
  name: { type: Schema.Types.String },
  description: { type: Schema.Types.String },
  width: { type: Schema.Types.Number},
  height: { type: Schema.Types.Number},
  url: { type: Schema.Types.Date }
},
{ 
  strict: false,
  versionKey: false
});


pictureSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<Picture>('Picture', pictureSchema);
