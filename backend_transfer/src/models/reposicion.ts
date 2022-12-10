import { Schema, model, Document } from "mongoose";

export interface IReposicion extends Document {
  presentacion: { type: Schema.Types.ObjectId, ref: "Presentacion", index: true };
  fecha: Date;
  margen?: Number;
  valor?: Number;
}

export const reposicionSchema = new Schema({
  presentacion: { type: Schema.Types.ObjectId, ref: "Presentacion", default: null },
  fecha: {  type: Schema.Types.Date, default: null },
  margen: { type: Schema.Types.Number, default: 35 },
  valor: { type: Schema.Types.Number, default: 0 }
},{
  toJSON: { virtuals: true },
  timestamps: true,
})

reposicionSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

reposicionSchema.virtual('precio').get(function(){
  let fullName = '';
  if(this['relacion'] && this['relacion']['fullname'] && !this['pesable']){
    fullName = `${this['name']} ${this['contiene']} ${this['relacion'].fullname}` 
  } else {
    fullName =  `${this['name']} ${this['contiene']} ${this['unidad']}`;
  }
  if(this['articulo'].fullname) fullName = `${this['articulo'].fullname} ${fullName}`;
  return fullName;
});

export default model<IReposicion>('Reposicion', reposicionSchema);
