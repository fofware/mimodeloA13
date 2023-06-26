import { Schema, model, Document } from "mongoose";

export interface WAAuthenticated extends Document {
  cuenta: string;
  number: string;
  name: string;
  session?: any;
};

const WAAuthenticatedSchema = new Schema({
  fuenta: { type: Schema.Types.String, trim: true, index: true },
  number: { type: Schema.Types.String, trim: true, index: true },
  name: { type: Schema.Types.String, trim: true, index: true },
},
{ 
  strict: false,
  versionKey: false,
  timestamps: true,

});


WAAuthenticatedSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<WAAuthenticated>('authenticated', WAAuthenticatedSchema);