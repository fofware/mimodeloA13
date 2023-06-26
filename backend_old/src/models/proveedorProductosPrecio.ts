import { Schema, model, Document } from "mongoose";

export interface IProveedorProductoPrecio extends Document {
  proveedorProducto: string;
  proveedor: string;
  articulo: string;
  presentacion: string;
  fecha: Date;
  coheficiente: number;
  value: number;
};

const ProveedorProductoPrecioSchema = new Schema({
  proveedorProducto: { ref: "Proveedorproducto", type: Schema.Types.ObjectId, default: null },
  proveedor: { ref: "Proveedor", type: Schema.Types.ObjectId, default: null },
  articulo: { ref: "Articulo", type: Schema.Types.ObjectId, default: null },
  presentacion: { ref: "Presentacion", type: Schema.Types.ObjectId, default: null },
  fecha: { type: Schema.Types.Date, default: Date.now() },
  value: { type: Schema.Types.Number, default: 0 },
  cantidad: { type: Schema.Types.Number, default: 1 },
  coheficiente: { type: Schema.Types.Number, default: 1 },
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
