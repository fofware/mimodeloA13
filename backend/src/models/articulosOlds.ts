import { Schema, model, Document, ObjectId } from "mongoose";

export interface IArticulosOld extends Document {
  rubro: ObjectId;
  linea: ObjectId;
  fabricante: ObjectId;
  marca: ObjectId;
  modelo: ObjectId;
  especie: ObjectId;
  talla: ObjectId;
  edad: ObjectId;
  name: string;
  sText: string[];
  toFullName: string[];
  tags: string[];
  //
  d_fabricante: number;
  d_marca: number;
  d_modelo: number;
  d_rubro: number;
  d_linea: number;
  d_especie: number;
  d_edad: number;
  d_talla: number;
  //d_raza: boolean;
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

const articulosOldSchema = new Schema({
  rubro: { ref: "Rubro", type: Schema.Types.ObjectId, default: null, index: true },
  linea: { ref: "Linea", type: Schema.Types.ObjectId, default: null, index: true },
  fabricante: { ref: "Fabricante", type: Schema.Types.ObjectId, default: null, index: true },
  marca: { ref: "Marca", type: Schema.Types.ObjectId, default: null, index: true },
  modelo: { ref: "Modelo", type: Schema.Types.ObjectId, default: null, index: true },
  especie: { ref: "Especie", type: Schema.Types.ObjectId, default: null, index: true },
  talla: { ref: "Talla", type: Schema.Types.ObjectId, default: null, index: true },
  edad: { ref: "Edad", type: Schema.Types.ObjectId, default: null, index: true },
  name: { type: Schema.Types.String, trim: true, default: null, index: true },
  fullname: { type: Schema.Types.String, trim: true, default: null, index: true },
  sText: [{ type: Schema.Types.String, trim: true, index: true }],
  tags: [{ type: Schema.Types.String, trim: true, index: true }],
  toFullName:[{type: Schema.Types.String, trim: true}],
  //
  d_fabricante: { type: Schema.Types.Number, default: -1 },
  d_marca: { type: Schema.Types.Number, default: -1 },
  d_modelo: { type: Schema.Types.Number, default: -1 },
  d_rubro: { type: Schema.Types.Number, default: -1 },
  d_linea: { type: Schema.Types.Number, default: -1 },
  d_especie: { type: Schema.Types.Number, default: -1 },
  d_edad: { type: Schema.Types.Number, default: -1 },
  //d_raza: { type: Schema.Types.Number, default: -1 },
  d_talla: { type: Schema.Types.Number, default: -1 },
  d_name: { type: Schema.Types.Number, default: -1 },
  //
  detalles: { type: Schema.Types.String, trim: true, default: '' },
  //formula: [],
  //beneficios: [],
  //extradata: [],
  presentaciones: [{ ref: "Presentacion", type: Schema.Types.ObjectId }],
  //
  showName: [],
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


articulosOldSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IArticulosOld>('Articulosold', articulosOldSchema);