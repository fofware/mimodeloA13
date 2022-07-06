import { Schema, model, Document } from "mongoose";

export interface IProveedorProducto extends Document {
  proveedor: string;
  fabricante: string;
  marca: string;
  articulo: string;
  presentacion: string;
  codigo: string;
  names: [];
};

const proveedorProductoSchema = new Schema({
  proveedor: { ref: "Proveedor", type: Schema.Types.ObjectId, default: null },
  fabricante: {ref: 'Fabricante', type: Schema.Types.ObjectId, default: null },
  marca: {ref: 'Marca', type: Schema.Types.ObjectId, default: null },
  articulo: {ref: 'Articulo', type: Schema.Types.ObjectId, default: null },
  presentacion: { ref: "Presentacion", type: Schema.Types.ObjectId, default: null },
  codigo: { type: Schema.Types.String, trim: true, default: '', index: true }, 
  name: [{ type: Schema.Types.String, trim: true, default: '', index: true }]
},
{ 
  strict: false,
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtual
});

proveedorProductoSchema.virtual('v_prodname', {
  ref: 'ProductoName',
  localField: 'presentacion',
  foreignField: '_id'
});


proveedorProductoSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IProveedorProducto>('ProveedorProducto', proveedorProductoSchema);