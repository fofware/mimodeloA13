import { Schema, model, Document, SchemaType } from "mongoose";

export interface WappMessage extends Document {
  from: string;
  to: string;
  serialized: string;
  timestamp: number;
};

const MessageSchema = new Schema({
  from: { type: Schema.Types.String, index: true },
  to: { type: Schema.Types.String, index: true },
  serialized: { type: Schema.Types.String, index: true},
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