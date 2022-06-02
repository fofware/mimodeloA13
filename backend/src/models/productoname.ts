import { Schema, model, Document } from "mongoose";

export interface IProductoName extends Document {
  fullName: String;
  fabricante?: String;
  marca?: String;
  rubro?: String;
  linea?: String;
  especie?: String;
  edad?: String;
  raza?: String;
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
  reventa?: Number;
  reventa1?: Number;
  reventa2?: Number;
  stock?: Number;
  precioref?: Number;
  art_name?: String;
  prodName?: String;
}

const productoNameSchema = new Schema({
  // Artículo
  _id: { type: Schema.Types.ObjectId, ref: "productos", default: null }
  , fullName: { type: Schema.Types.String, default: '', index: true }
  , fabricante: { type: String, trim: true, default: '', index: true } // Nestle
  , marca: { type: Schema.Types.String, trim: true, default: '', index: true }      // Purina Dog Chow / Purina Cat Chow
  , rubro: { type: Schema.Types.String, trim: true, default: '', index: true }      // Alimento Seco / Alimento Húmedo
  , linea: { type: Schema.Types.String, trim: true, default: '', index: true }      // ???????
  , especie: { type: Schema.Types.String, trim: true, default: '', index: true }   // Gato
  , edad: { type: Schema.Types.String, trim: true, default: '', index: true }
  , raza: { type: Schema.Types.String, trim: true, default: '', index: true }
  , image: { type: Schema.Types.String, trim: true, default: "" }
  , tags: { type: Schema.Types.String, trim: true, default: '', index: true  }
  // producto  
  , plu: { type: Schema.Types.String, trim: true, default: "", index: true }
  , ean: { type: Schema.Types.String, trim: true, default: '', index: true }
  , contiene: { type: Schema.Types.Number, default: 0, index: true }
  , unidad: { type: String, trim: true, default: "" }

  , pVenta: { type: Schema.Types.Boolean, default: true, index: true }
  , pCompra: { type: Schema.Types.Boolean, default: true, index: true }
  , oferta: { type: Schema.Types.Boolean, default: false, index: true }
  // precio
  , desde: { type: Schema.Types.Date, default: null, index: true }
  , lista: { type: Schema.Types.Number, default: 0, index: true }
  , calc_precio: { type: Schema.Types.Number, default: 0, index: true }
  , showPrecio: { type: Schema.Types.Number, default: 0, index: true }
  , precio: { type: Schema.Types.Number, default: 0, index: true }
  , precio_desde: { type: Schema.Types.Date, default: null, index: true }
  , precio_hasta: { type: Schema.Types.Date, default: null, index: true }
  , reventa: { type: Schema.Types.Number, default: 0, index: true }
  , reventa1: { type: Schema.Types.Number, default: 0, index: true }
  , reventa2: { type: Schema.Types.Number, default: 0, index: true }
  , stock: { type: Schema.Types.Number, default: 0, index: true }
  , precioref: { type: Schema.Types.Number, default: 0, index: true }
  , art_name: { type: Schema.Types.String, default: '', index: true  }
  , prodName: { type: Schema.Types.String, default: '', index: true  }
},{
  timestamps: false,
})


/*
productoNameSchema.index(
  { 
    fullName : "text",
    fabricante: 'text',
    marca: 'text',
    rubro: 'text',
    linea: 'text',
    especie: 'text',
    edad: 'text',
    raza: 'text',    
    contiene: "text",
    unidad: "text",
    tags: "text"
  },
  { 
    default_language: "spanish",
    name: "ProductoNameTextIndex"
  }
)
*/

productoNameSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IProductoName>('ProductoName', productoNameSchema);
