import { Schema, model, Document, ObjectId } from "mongoose";

export interface IArticulo extends Document {
  clase: String;
  fabricante: ObjectId;
  marca: ObjectId;
  modelo: ObjectId;
  especie: ObjectId;
  talla: ObjectId;
  edad: ObjectId;
  name: string;
  rubro: ObjectId;
  linea: ObjectId;
  fullname: String;
  showName: [],
  sText: string[];
  tags: string[];
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
  //
  margen: number;
};

const articuloSchema = new Schema({
  clase: { type: Schema.Types.String, default: 'producto', index: true},
  fabricante: { ref: "Fabricante", type: Schema.Types.ObjectId, default: null, index: true },
  marca: { ref: "Marca", type: Schema.Types.ObjectId, default: null, index: true },
  modelo: { ref: "Modelo", type: Schema.Types.ObjectId, default: null, index: true },
  especie: { ref: "Especie", type: Schema.Types.ObjectId, default: null, index: true },
  talla: { ref: "Talla", type: Schema.Types.ObjectId, default: null, index: true },
  edad: { ref: "Edad", type: Schema.Types.ObjectId, default: null, index: true },
  rubro: { ref: "Rubro", type: Schema.Types.ObjectId, default: null, index: true },
  linea: { ref: "Linea", type: Schema.Types.ObjectId, default: null, index: true },
  name: { type: Schema.Types.String, trim: true, default: null, index: true },
  fullname: { type: Schema.Types.String, trim: true, default: null, index: true },
  showName: [],
  sText: [{ type: Schema.Types.String, trim: true, index: true }],
  tags: [{ type: Schema.Types.String, trim: true, index: true }],
  //
  detalles: { type: Schema.Types.String, trim: true, default: '' },
  //
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

/*
articuloSchema.virtual('fullname').get(function(){
  let fullName = '';
  let sep = '';
  this.showName.map( f => {
    if(f === 'name')
      fullName += sep+this[f];
    else
      fullName += sep+this[f].name;
    sep =  ' ';
  })
  return fullName;
})
*/
export default model<IArticulo>('Articulo', articuloSchema);