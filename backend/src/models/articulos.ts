import { Schema, model, Document, isValidObjectId } from "mongoose";

export interface IArticulo extends Document {
  fabricante: string;
  marca: string;
  rubro: string;
  linea: string;
  especie: string;
  edad: string;
  raza: string;
  name: string;
  tags: string;
  //
  d_fabricante: boolean;
  d_marca: boolean;
  d_rubro: boolean;
  d_linea: boolean;
  d_especie: boolean;
  d_edad: boolean;
  d_raza: boolean;
  //
  detalles: string;
  formula: [];
  beneficios: [];
  presentaciones: [];
  //
  private_web: boolean;
  image: string;
  images: [];
  videos: [];
  url: string;
  iva: number;
  //
  margen: number;
};

const articuloSchema = new Schema({
  fabricante: { type: Schema.Types.String, trim: true, default: '', index: true }, // Nestle
  marca: { type: Schema.Types.String, trim: true, default: '', index: true },      // Purina Dog Chow / Purina Cat Chow
  rubro: { type: Schema.Types.String, trim: true, default: '', index: true },      // Alimento Seco / Alimento Húmedo
  linea: { type: Schema.Types.String, trim: true, default: '', index: true },      // ???????
  especie: { type: Schema.Types.String, trim: true, default: '', index: true },   // Gato
  edad: { type: Schema.Types.String, trim: true, default: '', index: true },
  raza: { type: Schema.Types.String, trim: true, default: '', index: true },
  name: { type: Schema.Types.String, trim: true, default: '', index: true },      // Gatitos Carne y Leche
  tags: { type: Schema.Types.String, trim: true, default: '', index: true },
  //
  d_fabricante: { type: Schema.Types.Boolean, default: false },
  d_marca: { type: Schema.Types.Boolean, default: true },
  d_rubro: { type: Schema.Types.Boolean, default: false },
  d_linea: { type: Schema.Types.Boolean, default: false },
  d_especie: { type: Schema.Types.Boolean, default: false},
  d_edad: { type: Schema.Types.Boolean, default: false},
  d_raza: { type: Schema.Types.Boolean, default: false},
  //
  detalles: { type: Schema.Types.String, trim: true, default: '' },
  formula: [],
  beneficios: [],
  presentaciones: [{ ref: "Presentacion", type: Schema.Types.ObjectId, default: [] }],
  //
  private_web: {type: Schema.Types.Boolean, default: false, index: true },
  image: { type: Schema.Types.String, trim: true, required: false },
  images: [{ type: Schema.Types.String, trim: true, required: false }],
  videos:[{ type: Schema.Types.String, trim: true, required: false }],
  url: { type: Schema.Types.String, trim: true, required: false, default:'' },
  iva: { type: Schema.Types.Number, default: 0},
  margen: { type: Schema.Types.Number, default: 35},
},
{ 
  toJSON: { virtuals: true },
  strict: false,
});


articuloSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

articuloSchema.virtual('fullname').get(function(){
  let fullName = '';
  let sep = '';
  if(this.d_fabricante){
    fullName = this.fabricante;
    sep = ' ';
  }
  if(this.d_marca){
    fullName += sep+this.marca;
    sep = ' ';
  }
  if (this.name){
    fullName += sep+this.name;
    sep = ' ';
  }
  if(this.d_especie){
    fullName += sep+this.especie;
    sep = ' ';
  }
  if(this.d_edad){
    fullName += sep+this.edad;
    sep = ' ';
  }
  if(this.d_raza){
    fullName += sep+this.raza;
    sep = ' ';
  } 
  if(this.d_rubro){
    fullName += sep+this.rubro;
    sep = ' ';
  } 
  if(this.d_linea){
    fullName += sep+this.linea;
    sep = ' ';
  } 
  return fullName;
})

export default model<IArticulo>('Articulo', articuloSchema);

