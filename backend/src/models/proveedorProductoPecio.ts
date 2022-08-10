import { Schema, model, Document } from "mongoose";

export interface IProveedorProductoPrecio extends Document {
  proveedorProducto: string;
  fecha: Date;
  coheficiente: number;
  value: number;
};

const ProveedorProductoPrecioSchema = new Schema({
  proveedorProducto: { ref: "Proveedorproducto", type: Schema.Types.ObjectId, default: null },
  fecha: { type: Schema.Types.Date, default: Date.now() },
  coheficiente: { type: Schema.Types.Number, default: 1 },
  value: { type: Schema.Types.Number, default: 0 },
},
{ 
  strict: false,
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  //toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtual
});
//
ProveedorProductoPrecioSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IProveedorProductoPrecio>('ProveedorProductoPrecio', ProveedorProductoPrecioSchema);
