import { Schema, model, Document } from "mongoose";

export interface IProductoName extends Document {
  fullName: string;
  contiene?: number;
  unidad?: string;
  pVenta?: boolean;
  pCompra?: boolean;
  ean?: string;
  plu?: number;
  image?: string;
  tags?: string;
}

const productoNameSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: "productos", default: null }
  , fullName: { type: Schema.Types.String, default: ''}
  , fabricante: { type: String, trim: true, default: '', index: true } // Nestle
  , marca: { type: String, trim: true, default: '', index: true }      // Purina Dog Chow / Purina Cat Chow
  , rubro: { type: String, trim: true, default: '', index: true }      // Alimento Seco / Alimento Húmedo
  , linea: { type: String, trim: true, default: '', index: true }      // ???????
  , especie: { type: String, trim: true, default: '', index: true }   // Gato
  , edad: { type: String, trim: true, default: '', index: true }
  , raza: { type: String, trim: true, default: '', index: true }
  , contiene: { type: Number, default: 0, index: true }
  , unidad: { type: String, trim: true, default: "" }
  , pVenta: { type: Boolean, default: true, index: true }
  , pCompra: { type: Boolean, default: true, index: true }
  , ean: { type: String, trim: true, default: '', index: true }
  , plu: { type: String, default: "", index: true }
  , image: { type: String, trim: true, default: "" }
  , tags: { ref: "tags", type: String, default: ''}
},{
  timestamps: false,
})


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

productoNameSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error.message);
});

export default model<IProductoName>('ProductoName', productoNameSchema);
