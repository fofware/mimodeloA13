import { Schema, model, Document } from "mongoose";

export interface IProveedorProducto extends Document {
  proveedor: Object;
  codigo: String;
  names: [];
  articulo: Object;
  presentacion: Object;
};

const proveedorProductoSchema = new Schema({
  proveedor: [{ ref: "Proveedor", type: Schema.Types.ObjectId, default: null }],
  codigo: { type: Schema.Types.String, trim: true, default: '', index: true }, 
  name: [{ type: Schema.Types.String, trim: true, default: '', index: true }],
  articulo: {ref: 'Articulo', type: Schema.Types.ObjectId, default: null },
  presentaciones: { ref: "Presentacion", type: Schema.Types.ObjectId, default: null }
},
{ 
  strict: false,
});

proveedorProductoSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IProveedorProducto>('ProveedorProducto', proveedorProductoSchema);