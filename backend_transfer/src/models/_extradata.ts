import { Schema, model, Document } from "mongoose";

export interface I_ExtaData extends Document {
  articulo: string;
  order: number;
  name: string;
  value: string;
  showname: boolean;
  showvalue: boolean;
  iconos: [];
};

const _extradataSchema = new Schema({
  articulo: {type: Schema.Types.ObjectId, ref: 'articulo'},
  order: { type: Schema.Types.Number },
  name: { type: Schema.Types.String, trim: true, default: '' },
  value: { type: Schema.Types.String, trim: true, default: '' },
  showname: { type: Schema.Types.Boolean, default: false },
  showvalue: { type: Schema.Types.Boolean, default: false },
  iconos: [{ type: Schema.Types.String, default: null}],
},
{ 
  strict: false,
  versionKey: false,
  timestamps: false
});


_extradataSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<I_ExtaData>('_ExtraData', _extradataSchema);