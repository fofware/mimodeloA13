import { Schema, model, Document } from "mongoose";

export interface IPresentacion extends Document {
  _id?: Object;
  ean?: String;
  articulo?: Object;
  relacion?: Object;
  name?: String;
  pCompra?: Boolean;
  pVenta?: Boolean;
  pInsumo?: Boolean;
  pServicio?: Boolean;
  pElaborado?: Boolean;
  pesable?: Boolean;
  contiene?: Number;
  unidad?: String;
  image?: String;
  images?: [ String ];
  tags?: [String];
}

const presentacionSchema = new Schema({
  _id: { type: Schema.Types.ObjectId }
  , ean: { type: Schema.Types.String, trim: true, default: '', index: true }
  , articulo: { type: Schema.Types.ObjectId, ref: "Articulo", index: true }
  , relacion: { type: Schema.Types.ObjectId, ref: "Presentacion", default: null, index: true }
  , name: { type: Schema.Types.String, trim: true, default: "", index: true }
  , pCompra: {type: Schema.Types.Boolean, default: false, index: true}
  , pVenta: {type: Schema.Types.Boolean, default: false, index: true}
  , pInsumo: {type: Schema.Types.Boolean, default: false, index: true}
  , pServicio: {type: Schema.Types.Boolean, default: false, index: true}
  , pElaborado: {type: Schema.Types.Boolean, default: false, index: true}
  , pesable: {type: Schema.Types.Boolean, default: false, index: true}
  , contiene: { type: Schema.Types.Number, default: 0, index: true }
  , unidad: { type: Schema.Types.String, trim: true, default: "" }
  , image: { type: Schema.Types.String, trim: true, default: "" }
  , images: [{ type: Schema.Types.String, trim: true, default: "" }]
  , tags: [{ type: Schema.Types.String, trim: true }]

},{
  strict: true,
  versionKey: false,
  timestamps: false,
  toJSON: { virtuals: true },
})

presentacionSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

presentacionSchema.virtual('fullname').get(function(){
  let fullName = '';
  if(this.relacion && this.relacion['fullname'] && !this['pesable']){
    fullName = `${this.name} ${this.contiene} ${this.relacion['fullname']}` 
  } else {
    fullName =  `${this.name} ${this.contiene} ${this.unidad}`;
  }
  if(this.articulo['fullname']) fullName = `${this.articulo['fullname']} ${fullName}`;
  return fullName;
});

export default model<IPresentacion>('Presentacion', presentacionSchema);
