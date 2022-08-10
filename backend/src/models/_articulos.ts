import { Schema, model, Document, isValidObjectId } from "mongoose";

export interface I_Articulo extends Document {
  fabricante_id: object;
  fabricante: string;
  marca_id: object;
  marca: string;
  rubro_id: object;
  rubro: string;
  linea_id: object;
  linea: string;
  especie_id: object;
  especie: string;
  edad: string;
  raza: string;
  name: string;
  tags: string[];
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
  extradata: []; 
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

const _articuloSchema = new Schema({
  fabricante: { ref: "Fabricante", type: Schema.Types.ObjectId, default: null },
  fabricanteTxt: { type: Schema.Types.String, trim: true, default: '', index: true }, // Nestle
  marca: { ref: "Marca", type: Schema.Types.ObjectId, default: null },
  marcaTxt: { type: Schema.Types.String, trim: true, default: '', index: true },      // Purina Dog Chow / Purina Cat Chow
  rubro: { ref: "Rubro", type: Schema.Types.ObjectId, default: null },
  rubroTxt: { type: Schema.Types.String, trim: true, default: '', index: true },      // Alimento Seco / Alimento Húmedo
  linea: { ref: "Linea", type: Schema.Types.ObjectId, default: null },
  lineaTxt: { type: Schema.Types.String, trim: true, default: '', index: true },      // ???????
  especie: { ref: "Especie", type: Schema.Types.ObjectId, default: null },
  especieTxt: { type: Schema.Types.String, trim: true, default: '', index: true },   // Gato
  raza: { ref: "Raza", type: Schema.Types.ObjectId, default: null },
  razaTxt: { type: Schema.Types.String, trim: true, default: '', index: true },
  edad: { ref: "Edad", type: Schema.Types.ObjectId, default: null },
  edadTxt: { type: Schema.Types.String, trim: true, default: '', index: true },
  name: { type: Schema.Types.String, trim: true, default: '', index: true },
  sText: [{ type: Schema.Types.String, trim: true, index: true }],
  tags: [],//{ type: Schema.Types.String, trim: true, default: '', index: true }],
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
  extradata: [],
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


_articuloSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

_articuloSchema.virtual('fullname').get(function(){
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

export default model<I_Articulo>('_Articulo', _articuloSchema);