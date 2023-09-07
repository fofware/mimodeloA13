import { Schema, model, Document } from "mongoose";

export interface IverifyEmail extends Document {
  email: string;
  verify: number;
};

const verifyEmailSchema = new Schema({
  email: { type: Schema.Types.String, trim: true, index: true, unique: true, require: true, lowercase: true },
  verify: { type: Schema.Types.Number, index: true},
},
{ 
  strict: true,
  versionKey: false,
  timestamps: true,
});


verifyEmailSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IverifyEmail>('verifyEmail', verifyEmailSchema);