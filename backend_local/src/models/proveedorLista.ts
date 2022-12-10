import { Schema, model, Document } from "mongoose";

export interface IProveedorLista extends Document {
  proveedorProducto: string;
  proveedorGrupo: string;
  fchDesde: Date;
  value: number;
};

const proveedorListaSchema = new Schema({
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