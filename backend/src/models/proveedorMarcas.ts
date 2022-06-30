import { Schema, model, Document } from "mongoose";

export interface IProveedorMarca extends Document {
  proveedor: Object;
  marca: Object;
  name: String;
};

const proveedorMarcaSchema = new Schema({
  proveedor: { ref: "Proveedor", type: Schema.Types.ObjectId, default: null },
  marca: { ref: "Marca", type: Schema.Types.ObjectId, default: null },
  name: { type: Schema.Types.String, default: '' }
},
{ 
  strict: false,
});

proveedorMarcaSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IProveedorMarca>('ProveedorMarca', proveedorMarcaSchema);