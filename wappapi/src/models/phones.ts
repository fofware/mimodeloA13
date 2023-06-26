import { Schema, model, Document } from "mongoose";

export interface WappPhone extends Document {
  user: string;
  phone: string;
  email: string;
  activo: boolean,
  sessionId: string;
  rooms: []
};

const WappPhoneSchema = new Schema({
  user: { type: Schema.Types.String, trim: true, index: true },
  phone: { type: Schema.Types.String, trim: true, index: true },
  email: { type: Schema.Types.String, trim: true, index: true },
  activo: { type: Schema.Types.Boolean, index: true, default: false },
  sessionId: { type: Schema.Types.String, trim: true, index: true },
  rooms: []
},
{ 
  strict: false,
  timestamps: true,
  versionKey: false
});


WappPhoneSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<WappPhone>('phone', WappPhoneSchema);