import { Schema, model, Document } from "mongoose";

export interface WappMessage extends Document {
  from: string;
  to: string;
  myId: string;
  fromMe: boolean;
  ack: number;
  timestamp: number;
};

export const MessageSchema = new Schema({
  from: { type: Schema.Types.String, index: true },
  to: { type: Schema.Types.String, index: true },
  myid: {type: Schema.Types.String, index: true},
  fromMe: {type: Schema.Types.Boolean, index: true},
  ack: {type: Schema.Types.Number, index: true},
  timestamp: {type: Schema.Types.Number, index: true},
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