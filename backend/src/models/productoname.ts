import { Schema, model, Document } from "mongoose";

export interface IProductoName extends Document {
  fullname: string;
  fabricante?: string;
  fabricante_id?: string;
  marca?: string;
  marca_id?: string;
  rubro?: string;
  linea?: string;
  especie?: string;
  especie_id: string;
  edad?: string;
  raza?: string;
  contiene?: Number;
  unidad?: String;
  pVenta?: Boolean;
  pCompra?: Boolean;
  ean?: String;
  plu?: Number;
  image?: String;
  tags?: String;
  lista?: Number;
  calc_precio?: Number;
  showPrecio?: Number;
  precio?: Number;
  precio_desde?: Date;
  precio_hasta?: Date;
  oferta: Boolean;
  //reventa?: Number;
  //reventa1?: Number;
  //reventa2?: Number;
  stock?: Number;
  //precioref?: Number;
  art_name?: String;
  prodName?: String;
}

const productoNameSchema = new Schema({
  // Artículo
  _id: { type: Schema.Types.ObjectId, ref: "productos", default: null }
  , articulo: { type: Schema.Types.ObjectId, ref: "articulo", default: null }
  , fullname: { type: Schema.Types.String, default: '', index: true }
  , fabricante: { type: String, trim: true, default: '', index: true } // Nestle
  , fabricante_id: { type: Schema.Types.ObjectId, ref: "fabricante", default: null } // Nestle
  , marca: { type: Schema.Types.String, trim: true, default: '', index: true }      // Purina Dog Chow / Purina Cat Chow
  , marca_id: { type: Schema.Types.ObjectId, ref: "marca", default: null }      // Purina Dog Chow / Purina Cat Chow
  , rubro: { type: Schema.Types.String, trim: true, default: '', index: true }      // Alimento Seco / Alimento Húmedo
  , rubro_id: { type: Schema.Types.ObjectId, ref: "rubro", default: null }      // Alimento Seco / Alimento Húmedo
  , linea: { type: Schema.Types.String, trim: true, default: '', index: true }      // ???????
  , linea_id: { type: Schema.Types.ObjectId, ref: "linea", default: null }      // ???????
  , especie: { type: Schema.Types.String, trim: true, default: '', index: true }   // Gato
  , especie_id: { type: Schema.Types.ObjectId, ref: "especie", default: null }      // ???????
  , edad: { type: Schema.Types.String, trim: true, default: '', index: true }
  , raza: { type: Schema.Types.String, trim: true, default: '', index: true }
  , image: { type: Schema.Types.String, trim: true, default: "" }
  , tags: { type: Schema.Types.String, trim: true, default: '', index: true  }
  // producto  
  , plu: { type: Schema.Types.String, trim: true, default: "", index: true }
  , ean: { type: Schema.Types.String, trim: true, default: '', index: true }
  , contiene: { type: Schema.Types.Number, default: 0, index: true }
  , unidad: { type: Schema.Types.String, trim: true, default: "" }

  , pesable: { type: Schema.Types.Boolean, default: false, index: true }
  , pVenta: { type: Schema.Types.Boolean, default: true, index: true }
  , pCompra: { type: Schema.Types.Boolean, default: true, index: true }
  , oferta: { type: Schema.Types.Boolean, default: false, index: true }
  , oferta_precio: { type: Schema.Types.Number, default: 0, index: true }
  // precio
  , oferta_desde: { type: Schema.Types.Date, default: null, index: true }
  , oferta_hasta: { type: Schema.Types.Date, default: null, index: true }
  //, lista: { type: Schema.Types.Number, default: 0, index: true }
  //, calc_precio: { type: Schema.Types.Number, default: 0, index: true }
  , precio: { type: Schema.Types.Number, default: 0, index: true }
  //, precio_desde: { type: Schema.Types.Date, default: null, index: true }
  //, precio_hasta: { type: Schema.Types.Date, default: null, index: true }
  //, reventa: { type: Schema.Types.Number, default: 0, index: true }
  //, reventa1: { type: Schema.Types.Number, default: 0, index: true }
  //, reventa2: { type: Schema.Types.Number, default: 0, index: true }
  , stock: { type: Schema.Types.Number, default: 0 }
  //, precioref: { type: Schema.Types.Number, default: 0, index: true }
  , art_name: { type: Schema.Types.String, default: '', index: true  }
  , prodName: { type: Schema.Types.String, default: '', index: true  }
},{
  timestamps: false,
  versionKey: false
})


productoNameSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IProductoName>('ProductoName', productoNameSchema);
