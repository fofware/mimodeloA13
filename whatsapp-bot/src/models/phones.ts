import { Schema, model, Document } from "mongoose";

export interface WappPhone extends Document {
  user: string;
  phone: string;
  email: string;
  rooms: []
};

const WappPhoneSchema = new Schema({
  user: { type: Schema.Types.String, trim: true, index: true },
  phone: { type: Schema.Types.String, trim: true, index: true },
  email: { type: Schema.Types.String, trim: true, index: true },
  rooms: []
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