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

MessageSchema.on('save', data => {
  // "_id index cannot be sparse"
  console.log("Save Data from Schema");
  console.log(data);
});

MessageSchema.on('update', data => {
  // "_id index cannot be sparse"
  console.log("Update Data from Schema");
  console.log(data);
});

export default model<WappMessage>('message', MessageSchema);