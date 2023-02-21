import { Schema, model, Document } from "mongoose";

export interface Iotro extends Document {
  topic: string;
};

const otroSchema = new Schema({
  topic: { type: Schema.Types.String, trim: true, index: true },
},
{ 
  strict: false,
  timestamps: true,
  versionKey: false
});


otroSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<Iotro>('otro', otroSchema);