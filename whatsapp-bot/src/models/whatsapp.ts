import { Schema, model, Document } from "mongoose";

export interface WappMessage extends Document {
  from: string;
  to: string;
};

const MessageSchema = new Schema({
  from: { type: Schema.Types.String, trim: true, index: true },
  to: { type: Schema.Types.String, trim: true, index: true },
},
{ 
  strict: false,
  versionKey: false
});


MessageSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<WappMessage>('message', MessageSchema);