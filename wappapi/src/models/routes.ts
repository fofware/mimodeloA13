import { Schema, model, Document } from "mongoose";

export interface WappRoute extends Document {
  phone: string;
};

const WappRouteSchema = new Schema({
  phone: { type: Schema.Types.String, trim: true, index: true },
},
{ 
  strict: true,
  timestamps: false,
  versionKey: false
});


WappRouteSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<WappRoute>('routes', WappRouteSchema);