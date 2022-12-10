import { Schema, model, Document } from "mongoose";

export interface IProveedorLista extends Document {
  proveedorProducto: string;
  proveedorGrupo: string;
  fchDesde: Date;
  value: number;
};
/**
 * Tipos de listas
 * 
 * Precio 
 * Precio1, condicion1, Precio2, condicion2, Precio(N), condicion(N)
 * Precio, condicion1, coeficiente1, Precio(N), condicion(N), coeficiente(N)
 * Precio1, condicionGrupo1, Precio(N), condicionGrupo(N)
 * Precio1, condicionGrupo1, coeficiente1, Precio(N), condicionGrupo(N), coeficiente(N)
 * Condicion es Suma de Unidades < X
 *              Suma de Unidades > X
 * Condicion de Gpo es Suma de Unidades de productos distintos
 * Tentativa de fd
 * producto, Precio, condicion, grupo , coeficiente
 * prod1   , 10    , null     , null  , 1
 * prod2   , 10    , <10      , null  , 1
 * prod2   , 8     , >9       , null  , 1
 *  
 * prod3   , 10    , null     
 * 
 * 
 * Condiciones 
 *  cond_id
 *  cond_proveedor
 *  condicion <9 / >10 /
 *  productos
 */

export const proveedorListaSchema = new Schema({
  proveedorProducto: { ref: "Proveedorproducto", type: Schema.Types.ObjectId, default: null },
  proveedorGrupo: {ref: 'ProveedorGrupo', type: Schema.Types.ObjectId, default: null },
  fchDesde: { type: Schema.Types.Date, default: Date.now },
  value:{ type: Schema.Types.Number, default: 0 },
},
{ 
  strict: false,
  versionKey: false,
  timestamps: true,
  //toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  //toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtual
});
//
//proveedorListaSchema.virtual('fullname').get(function(){
//  let fullname = `(ProveedorProducto Error) Missing polulate({path:'v_prodname', select: 'fullname -_id'})`;
//  if(this.v_prodname) fullname = this.v_prodname[0].fullname;
//  return fullname;
//});
//
//proveedorListaSchema.virtual('v_prodname', {
//  ref: 'ProductoName',
//  localField: 'presentacion',
//  foreignField: '_id'
//});
//
proveedorListaSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IProveedorLista>('ProveedorLista', proveedorListaSchema);