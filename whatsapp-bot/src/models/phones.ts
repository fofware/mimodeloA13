import { Schema, model, Document } from "mongoose";

export interface WappPhone extends Document {
  cuenta: string;
  number: string;
  name: string;
};

const WappPhoneSchema = new Schema({
  owner: { type: Schema.Types.String, trim: true, index: true },
  number: { type: Schema.Types.String, trim: true, index: true },
  cuenta: { type: Schema.Types.String, trim: true, index: true },
  name: { type: Schema.Types.String, trim: true, index: true }
},
{ 
  strict: false,
  versionKey: false
});


WappPhoneSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<WappPhone>('phone', WappPhoneSchema);