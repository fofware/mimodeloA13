import { Schema, model, Document } from "mongoose";

export interface I_Presentacion extends Document {
  _id?: Object;
  ean?: String;
  plu?: String;
  articulo?: Object;
  relacion?: Object;
  name?: String;
  contiene?: Number;
  unidad?: String;
  image?: String;
  images?: [ String ];
  tags?: String;

  servicio?: Boolean;
  insumo?: Boolean;
  pesable?: Boolean;
  pVenta?: Boolean;
  pCompra?: Boolean;

  iva?: Number;
  margen?: Number;
  // ? Oferta
  oferta?: Boolean;
  off_value?: Number;
  off_desde?: Date;
  off_hasta?: Date;
  //
  value?: Number;
  fch_value?: Date;
  // ? compra
  compra?: Number;
  compra_fecha?: Date;
  // ? reosición
  reposicion?: Number;
  reposicion_fecha?: Date;
  // ? stock
  stock?: Number;
  stockMin?: Number;
  stockMax?: Number;
}

const _presentacionSchema = new Schema({
  _id: { type: Schema.Types.ObjectId }
  , ean: { type: Schema.Types.String, trim: true, default: '', index: true }
  , plu: { type: Schema.Types.String, default: "", index: true }
  , articulo: { type: Schema.Types.ObjectId, ref: "_Articulo", index: true }
  , relacion: { type: Schema.Types.ObjectId, ref: "_Presentacion", default: null, index: true }
  , name: { type: Schema.Types.String, trim: true, default: "", index: true }
  , contiene: { type: Schema.Types.Number, default: 0, index: true }
  , unidad: { type: Schema.Types.String, trim: true, default: "" }
  , image: { type: Schema.Types.String, trim: true, default: "" }
  , images: [{ type: Schema.Types.String, trim: true, default: "" }]
  , tags: { type: Schema.Types.String, default: ''}

  , servicio: { type: Schema.Types.Boolean, default: false, index: true }
  , insumo: { type: Schema.Types.Boolean, default: false, index: true }
  , pesable: { type: Schema.Types.Boolean, default: false, index: true }
  , pVenta: { type: Schema.Types.Boolean, default: true, index: true }
  , pCompra: { type: Schema.Types.Boolean, default: true, index: true }

  , iva: { type:Schema.Types.Number, default: 0 }
  , margen: { type: Schema.Types.Number, default: 35 }

  , oferta: { type: Schema.Types.Boolean, default: false }
  , off_value: { type: Schema.Types.Number, default: 0 }
  , off_desde: {  type: Schema.Types.Date, default: null }
  , off_hasta: { type:  Schema.Types.Date, default: null }
  //
  , value: { type: Schema.Types.Number, default: 0 }
  , fch_value: { type: Schema.Types.Date, default: Date.now() }
  //
  , compra: { type: Schema.Types.Number, default:0 }
  , compra_fecha: { type: Schema.Types.Date }
  //
  , reposicion: { type: Schema.Types.Number, default:0 }
  , reposicion_fecha: { type: Schema.Types.Date }
  //
  , stock: { type: Schema.Types.Number, default: 0 }
  , stockMin: { type: Schema.Types.Number, default: 0 }
  , stockMax: { type: Schema.Types.Number, default: 0 }
  , user_id: { type: Schema.Types.ObjectId, ref: "user", default: null, index: true }
},{
  toJSON: { virtuals: true },
  timestamps: true,
})

_presentacionSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

_presentacionSchema.virtual('fullname').get(function(){
  let fullName = '';
  if(this.relacion && this.relacion.fullname && !this.pesable){
    fullName = `${this.name} ${this.contiene} ${this.relacion.fullname}` 
  } else {
    fullName =  `${this.name} ${this.contiene} ${this.unidad}`;
  }
  if(this.articulo.fullname) fullName = `${this.articulo.fullname} ${fullName}`;
  return fullName;
});

export default model<I_Presentacion>('_Presentacion', _presentacionSchema);
