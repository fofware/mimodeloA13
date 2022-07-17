import { Schema, model, Document } from "mongoose";

export interface IProductoName extends Document {
  _id?: String;
  ean?: String;
  articulo?: String;
  fabricante?: string;
  marca?: string;
  rubro?: string;
  linea?: string;
  especie?: string;
  edad?: string;
  raza?: string;
  image?: String;
  tags?: String;
  art_name?: String;
  prodName?: String;
}

const productoNameSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: "Presentacion", default: null }
  , ean: { type: Schema.Types.String, trim: true, default: '', index: true }
  , articulo: { type: Schema.Types.ObjectId, ref: "Articulo", default: null }
  , fabricante: { type: Schema.Types.ObjectId, ref: "Fabricante", default: null } // Nestle
  , marca: { type: Schema.Types.ObjectId, ref: "Marca", default: null }      // Purina Dog Chow / Purina Cat Chow
  , rubro: { type: Schema.Types.ObjectId, ref: "Rubro", default: null }      // Alimento Seco / Alimento Húmedo
  , linea: { type: Schema.Types.ObjectId, ref: "Linea", default: null }      // ???????
  , especie: { type: Schema.Types.ObjectId, ref: "Especie", default: null }      // ???????
  , edad: { type: Schema.Types.ObjectId, ref: "Edad", default: null }      // ???????
  , raza: { type: Schema.Types.ObjectId, ref: "Raza", default: null }      // ???????
  , image: { type: Schema.Types.String, trim: true, default: "" }
  , tags: { type: Schema.Types.String, trim: true, default: '', index: true  }
  , artName: { type: Schema.Types.String, default: '', index: true  }
  , prodName: { type: Schema.Types.String, default: '', index: true  }
},{
  strict: true,
  timestamps: false,
  versionKey: false,
  toJSON: { virtuals: true }
})

productoNameSchema.virtual('fullname').get(function(){
  return `${this.artName} ${this.prodName}`;
});

productoNameSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IProductoName>('ProductoName', productoNameSchema);
