import { Schema, model, Document } from "mongoose";

export interface IProveedor extends Document {
  name: string;
  /*
  fabricantes: [];
  marcas: [];
  articulos: [];
  presentaciones: [];
  lista: object;
  */
};

const proveedorSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true },
  /*
  fabricantes: [{ ref: "Fabricante", type: Schema.Types.ObjectId, default: null }],
  marcas: [{ ref: "Marca", type: Schema.Types.ObjectId, default: null }],
  articulos: [{ ref: "Articulo", type: Schema.Types.ObjectId, default: null }],
  presentaciones: [{ ref: "Presentacion", type: Schema.Types.ObjectId, default: null }],
  lista: { ref: "Lista", type: Schema.Types.ObjectId, default: null }
  */
},
{ 
  strict: false,
});

proveedorSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IProveedor>('Proveedor', proveedorSchema);