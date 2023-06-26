import { Schema, model, Document } from "mongoose";

export interface WappContacts extends Document {
  from: string;
  name: string;
  serialized: string;
  phone: string;
  fnumber: string;
  bot:[]
};

const WappContactsSchema = new Schema({
  from: { type: Schema.Types.String, trim: true, index: true },
  phone: { type: Schema.Types.String, trim: true, index: true },
  serialized: { type: Schema.Types.String, trim: true, index: true },
  fnumber: { type: Schema.Types.String, trim: true },
  name: { type: Schema.Types.String, trim: true, index: true },
  tipo: { type: Schema.Types.String, trim: true, index: true },
  never: { type: Schema.Types.Boolean, default: false },
  bot: { type: Schema.Types.Array, index: true, default: []},
},
{ 
  strict: false,
  timestamps: true,
  versionKey: false
});


WappContactsSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<WappContacts>('contact', WappContactsSchema);