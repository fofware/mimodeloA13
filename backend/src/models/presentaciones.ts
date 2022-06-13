import { Schema, model, Document } from "mongoose";

export interface IPresentacion extends Document {
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
  oferta_precio?: Number;
  oferta_desde?: Date;
  oferta_hasta?: Date;
  //
//  precio?: Number;
//  precio_desde?: Date;
//  precio_hasta?: Date;
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

const presentacionSchema = new Schema({
  _id: { type: Schema.Types.ObjectId }
  , ean: { type: Schema.Types.String, trim: true, default: '', index: true }
  , plu: { type: Schema.Types.String, default: "", index: true }
  , articulo: { type: Schema.Types.ObjectId, ref: "Articulo", index: true }
  , relacion: { type: Schema.Types.ObjectId, ref: "Presentacion", default: null, index: true }
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
  , oferta_precio: { type: Schema.Types.Number, default: 0 }
  , oferta_desde: {  type: Schema.Types.Date, default: null }
  , oferta_hasta: { type:  Schema.Types.Date, default: null }
  //
  , precio: { type: Schema.Types.Number, default: 0 }
  , precio_desde: { type: Schema.Types.Date }
  , precio_hasta: { type: Schema.Types.Date }
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

presentacionSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

presentacionSchema.virtual('fullname').get(function(){
  let fullName = '';
  if(this.relacion && this.relacion.fullname && !this.pesable){
    fullName = `${this.name} ${this.contiene} ${this.relacion.fullname}` 
  } else {
    fullName =  `${this.name} ${this.contiene} ${this.unidad}`;
  }
  if(this.articulo.fullname) fullName = `${this.articulo.fullname} ${fullName}`;
  return fullName;
});

export default model<IPresentacion>('Presentacion', presentacionSchema);
