import { Schema, model, Document } from "mongoose";

export interface Iipn extends Document {
  gateway: string;
  topic: string;
};

const ipnSchema = new Schema({
  gateway: { type: Schema.Types.ObjectId, index: true },
  topic: { type: Schema.Types.String, trim: true, index: true },
},
{ 
  strict: false,
  timestamps: true,
  versionKey: false
});

ipnSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<Iipn>('ipn', ipnSchema);