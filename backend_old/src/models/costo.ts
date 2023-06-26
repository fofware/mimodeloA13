import { Schema, model, Document } from "mongoose";

export interface ICosto extends Document {
  _id?: string;
  compra?: Number;
  compra_fecha?: Date;
  reposicion?: Number;
  reposicion_fecha?: Date;
}

const costoSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: "Presentacion", default: null }
  , compra: { type: Schema.Types.Number, default:0 }
  , compra_fecha: { type: Schema.Types.Date }
  //
  , reposicion: { type: Schema.Types.Number, default:0 }
  , reposicion_fecha: { type: Schema.Types.Date }
},{
  strict: true,
  timestamps: false,
  versionKey: false,
  //toJSON: { virtuals: true }
})

//costoSchema.virtual('fullname').get(function(){
//  return `${this.artName} ${this.prodName}`;
//});

costoSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<ICosto>('Costo', costoSchema);