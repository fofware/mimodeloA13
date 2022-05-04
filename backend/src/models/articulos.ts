import { Schema, model, Document, isValidObjectId } from "mongoose";
import { ObjectID } from 'bson'

export interface IArticulo extends Document {
  fabricante: string;
  marca: string;
  rubro: string;
  linea: string;
  especie: string;
  edad: string;
  raza: string;
  name: string;
  d_fabricante: boolean;
  d_marca: boolean;
  d_rubro: boolean;
  d_linea: boolean;
  d_especie: boolean;
  d_edad: boolean;
  d_raza: boolean;
  private_web: boolean;
  image: string;
  images: [];
  videos: [];
  url: string;
  iva: number;
  margen: number;
  tags: string;
  formula: [];
  detalles: [];
  beneficios: [];
//  getFullName: () => Promise<string>
  setObjectIDs: () => Promise<void>
};

const articuloSchema = new Schema({
  fabricante: { type: String, trim: true, default: '', index: true }, // Nestle
  marca: { type: String, trim: true, default: '', index: true },      // Purina Dog Chow / Purina Cat Chow
  rubro: { type: String, trim: true, default: '', index: true },      // Alimento Seco / Alimento Húmedo
  linea: { type: String, trim: true, default: '', index: true },      // ???????
  especie: { type: String, trim: true, default: '', index: true },   // Gato
  edad: { type: String, trim: true, default: '', index: true },
  raza: { type: String, trim: true, default: '', index: true },
  name: { type: String, trim: true, default: '', index: true },      // Gatitos Carne y Leche
  d_fabricante: {type: Boolean, default: false },
  d_marca: {type: Boolean, default: true },
  d_rubro: {type: Boolean, default: false },
  d_linea: {type: Boolean, default: false },
  d_especie: {type: Boolean, default: false},
  d_edad: {type: Boolean, default: false},
  d_raza: {type: Boolean, default: false},
  private_web: {type: Boolean, default: false, index: true },
  image: { type: String, trim: true, required: false },
  images: [{ type: String, trim: true, required: false }],
  videos:[{ type: String, trim: true, required: false }],
  url: { type: String, trim: true, required: false, default:'' },
  iva: {type:Number, default: 0},
  margen: { type: Number, default: 35},
  tags: { type: String, trim: true, default: '', index: true },
  formula: [],
  detalles: { type: String, trim: true, default: '' },
  beneficios: []
});

articuloSchema.index(
  {
    fabricante: "text",
    marca: "text",
    rubro: "text",
    linea: "text",
    especie: "text",
    edad: "text",
    raza: "text",
    name: "text",
    tags: "text"
  },
  {
    default_language: "spanish",
    name: "ArticuloTextIndex"
  }
)

articuloSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error.message);
});

articuloSchema.methods.setObjectIDs = async function (): Promise<void> {
  this._id = new ObjectID(this._id);
}

export default model<IArticulo>('Articulo', articuloSchema);

