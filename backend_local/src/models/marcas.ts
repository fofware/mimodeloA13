import { Schema, model, Document } from "mongoose";

export interface IMarca extends Document {
  name: string;
  fabricante: object;
  images: [];
};

const marcaSchema = new Schema({
  name: { type: Schema.Types.String, trim: true, default: '', index: true },
  fabricante: { ref: "Fabricante", type: Schema.Types.ObjectId, default: null },
  images: [{ type: Schema.Types.String, default: null}]
},
{ 
  strict: false,
  versionKey: false,
  //toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  //toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtual
});

/*
marcaSchema.virtual('fullname').get(function(){
  let fullname = `(ProveedorProducto Error) Missing polulate({path:'v_prodname', select: 'fullname -_id'})`;
  if(this.v_prodname) fullname = this.v_prodname[0].fullname;
  return fullname;
});
*/

/*
marcaSchema.virtual('prodname', {
  ref: 'Fabricante',
  localField: 'fabricante',
  foreignField: '_id'
});
*/
marcaSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IMarca>('Marca', marcaSchema);