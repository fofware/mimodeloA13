import { Schema, model, Document } from "mongoose";

export interface IArticulo extends Document {
  rubro: string;
  linea: string;
  fabricante: string;
  marca: string;
  especie: string;
  edad: string;
  raza: string;
  name: string;
  sText: string[];
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
  //formula: [];
  //beneficios: [];
  //extradata: [];
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
  rubro: { ref: "Rubro", type: Schema.Types.ObjectId, default: '', index: true },
  linea: { ref: "Linea", type: Schema.Types.ObjectId, default: '', index: true },
  fabricante: { ref: "Fabricante", type: Schema.Types.ObjectId, default: '', index: true },
  marca: { ref: "Marca", type: Schema.Types.ObjectId, default: '', index: true },
  especie: { ref: "Especie", type: Schema.Types.ObjectId, default: '', index: true },
  raza: { ref: "Raza", type: Schema.Types.ObjectId, default: '', index: true },
  edad: { ref: "Edad", type: Schema.Types.ObjectId, default: '', index: true },
  name: { type: Schema.Types.String, trim: true, default: '', index: true },
  sText: [{ type: Schema.Types.String, trim: true, index: true }],
  tags: [{ type: Schema.Types.String, trim: true, index: true }],
  toFullName:[{type: Schema.Types.String, trim: true}],
  //
  d_fabricante: { type: Schema.Types.Number, default: 0 },
  d_marca: { type: Schema.Types.Number, default: 0 },
  d_rubro: { type: Schema.Types.Number, default: 0 },
  d_linea: { type: Schema.Types.Number, default: 0 },
  d_especie: { type: Schema.Types.Number, default: 0 },
  d_edad: { type: Schema.Types.Number, default: 0 },
  d_raza: { type: Schema.Types.Number, default: 0 },
  //
  detalles: { type: Schema.Types.String, trim: true, default: '' },
  //formula: [],
  //beneficios: [],
  //extradata: [],
  presentaciones: [{ ref: "Presentacion", type: Schema.Types.ObjectId }],
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
  strict: true,
  versionKey: false
});


articuloSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

articuloSchema.virtual('fullname').get(function(){
  let fullName = '';
  let sep = '';
  if(this.d_fabricante){
    fullName = this.fabricante.name;
    sep = ' ';
  }
  if(this.d_marca){
    fullName += sep+this.marca.name;
    sep = ' ';
  }
  if (this.name){
    fullName += sep+this.name;
    sep = ' ';
  }
  if(this.d_especie){
    fullName += sep+this.especie.name;
    sep = ' ';
  }
  if(this.d_edad){
    fullName += sep+this.edad.name;
    sep = ' ';
  }
  if(this.d_raza){
    fullName += sep+this.raza.name;
    sep = ' ';
  } 
  if(this.d_rubro){
    fullName += sep+this.rubro.name;
    sep = ' ';
  } 
  if(this.d_linea){
    fullName += sep+this.linea.name;
    sep = ' ';
  } 
  return fullName;
})

export default model<IArticulo>('Articulo', articuloSchema);