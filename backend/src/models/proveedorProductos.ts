import { Schema, model, Document } from "mongoose";

export interface IProveedorProducto extends Document {
  proveedor: string;
  articulo: string;
  presentacion: string;
  codigo: string;
  names: string[];
};

const proveedorProductoSchema = new Schema({
  proveedor: { ref: "Proveedor", type: Schema.Types.ObjectId, default: null },
  articulo: {ref: 'Articulo', type: Schema.Types.ObjectId, default: null },
  presentacion: { ref: "Presentacion", type: Schema.Types.ObjectId, default: null },
  codigo: { type: Schema.Types.String, trim: true, default: '', index: true }, 
  name: [{ type: Schema.Types.String, trim: true, default: '', index: true }],
},
{ 
  strict: true,
  versionKey: false,
  timestamps: false,
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  //toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtual
});

proveedorProductoSchema.virtual('fullname').get(function(){
  //let fullname = `(ProveedorProducto Error) Missing polulate({path:'v_prodname', select: 'fullname -_id'})`;
  //if(this.v_prodname) fullname = this.v_prodname[0].fullname;
  let presentacion = `(ProveedorProducto Error) Missing populate({path: 'presentacion', select: 'fullname -_id'})`;
  let articulo = `(ProveedorProducto Error) Missing populate({path: 'articulo', populate: { path: 'fabricante marca rubro linea especie edad raza' }})`
  if(this.presentacion['fullname']) presentacion = this.presentacion['fullname'];
  if(this.articulo['fullname']) articulo = this.articulo['fullname']; 
  return `${articulo} ${presentacion}`;
});

//proveedorProductoSchema.virtual('v_prodname', {
//  ref: 'ProductoName',
//  localField: 'presentacion',
//  foreignField: '_id'
//});

proveedorProductoSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IProveedorProducto>('ProveedorProducto', proveedorProductoSchema);
