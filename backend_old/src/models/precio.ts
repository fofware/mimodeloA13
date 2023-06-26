import { Schema, model, Document } from "mongoose";

export interface IPrecio extends Document {
  _id?: string;
  fch_value: Date;
  value: number;
  off_value: number;
  off_desde: Date;
  off_hasta: Date;
}

const precioSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: "Presentacion" }
  , fch_value: { type: Schema.Types.Date, default: Date.now, index: true }
  , value: { type: Schema.Types.Number, default: 0 }
  , off_value: { type: Schema.Types.Number, default: 0 }
  , off_desde: {  type: Schema.Types.Date, default: null }
  , off_hasta: { type:  Schema.Types.Date, default: null }
  //
},{
  strict: true,
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true }
})

precioSchema.virtual('precio').get(function(){
  if(!this.off_desde && !this.off_hasta && !this.off_value) return this.value;
  let precio = this.value;
  const end = new Date(this.off_hasta).getTime();
  const ini = new Date(this.off_desde).getTime();
  const hoy = new Date().getTime();
  if( hoy >= ini ){
    if( hoy <= end ){
      precio = this.off_value || this.value
    }
  }
  return precio;
});

precioSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IPrecio>('Precio', precioSchema);