import { Schema, model, Document } from "mongoose";

export interface Iwebhooks extends Document {
  topic: string;
};

const webhooksSchema = new Schema({
  topic: { type: Schema.Types.String, trim: true, index: true },
},
{ 
  strict: false,
  timestamps: true,
  versionKey: false
});


webhooksSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<Iwebhooks>('webhooks', webhooksSchema);