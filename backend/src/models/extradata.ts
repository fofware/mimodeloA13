import { Schema, model, Document } from "mongoose";

export interface IExtaData extends Document {
  articulo: string;
  order: number;
  name: string;
  value: string;
  showname: boolean;
  showvalue: boolean;
  iconos: [];
};

const extradataSchema = new Schema({
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


extradataSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IExtaData>('ExtraData', extradataSchema);