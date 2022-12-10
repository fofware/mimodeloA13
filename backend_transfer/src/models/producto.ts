import { Schema, model, Document } from "mongoose";

export interface IProducto extends Document {
  _id?: object;
  articulo?: object;
  parent?: object;
  name?: string;
  contiene?: number;
  unidad?: string;
  tags?: string;

  pesable?: boolean;
  servicio?: boolean;
  pVenta?: boolean;
  pCompra?: boolean;
  codigo?: string;
  plu?: number;
  image?: string;

  precio?: number;
  precio_desde?: number;
  precio_hasta?: number;
  compra?: number;
  compra_fecha: number;
  reposicion?: number;
  reposicion_fecha: number;
  stock?: number;
  stockMin?: number;
  stockMax?: number;
  iva?: number;
  margen?: number;
 
}

export const productoSchema = new Schema({
  _id: { type: Schema.Types.ObjectId }
  , articulo: { type: Schema.Types.ObjectId, ref: "Articulo", index: true }
  , parent: { type: Schema.Types.ObjectId, ref: "Producto", default: null }
  , name: { type: String, trim: true, default: "", index: true }
  , contiene: { type: Number, default: 0, index: true }
  , unidad: { type: String, trim: true, default: "" }
  , precio: { type: Number, default: 0 }
  , precio_desde: { type: Schema.Types.Date }
  , precio_hasta: { type: Schema.Types.Date }
  , compra: { type: Number, default:0 }
  , compra_fecha: { type: Schema.Types.Date }
  , reposicion: { type: Number, default:0 }
  , reposicion_fecha: { type: Schema.Types.Date }
  , pesable: { type: Boolean, default: false, index: true }
  , servicio: { type: Boolean, default: false, index: true }
  , pVenta: { type: Boolean, default: true, index: true }
  , pCompra: { type: Boolean, default: true, index: true }
  , codigo: { type: String, trim: true, default: '', index: true }
  , plu: { type: String, default: "", index: true }
  , image: { type: String, trim: true, default: "" }
  , stock: { type: Number, default: 0 }
  , stockMin: { type: Number, default: 0 }
  , stockMax: { type: Number, default: 0 }
  , iva: { type:Number, default: 0 }
  , margen: { type: Number, default: 35 }
  , tags: { type: String, default: ''}
},{
  toJSON: { virtuals: true },
  timestamps: true,
  versionKey: false
})


productoSchema.index(
  { 
    name : "text",
    contiene: "text",
    unidad: "text",
    tags: "text"
  },
  { 
    default_language: "spanish",
    name: "ProductoTextIndex"
  }
);

productoSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error.message);
});

productoSchema.virtual('fullname').get(function(){
  if(this.parent && this.parent['fullname'] && !this.pesable){
    return `${this.name} ${this.contiene} ${this.parent['fullname']}` 
  }
  return `${this.name} ${this.contiene} ${this.unidad}`;
});

//productoSchema.virtual('fullname').get(function(){
  //let fullName = '';
  //let sep = '';
  //if(this.parent){
  //  if (this.pesable){
  //    fullName = `${this.articulo.fullname} ${this.name} ${this.contiene} ${this.unidad}`
  //  } else {
  //    fullName = `${this.articulo.fullname} ${this.name} ${this.contiene} ${this.unidad}`
//
  //  }
  //} else {
  //  fullName = `${this.articulo.fullname} ${this.name} ${this.contiene} ${this.unidad}`;
  //}
//  return `${this.articulo.fullname} ${this.name} ${this.contiene} ${this.unidad}`;
//})

/*
productoSchema.methods.getFullName = async function (): Promise<string> {
  let descr = "";
  let prod = this;
  if (prod.contiene && prod.contiene > 1) descr += `${prod.name} ${prod.contiene} ${prod.unidad}`
  else if (prod.unidad) descr += `${prod.name} ${prod.unidad}`
  else descr += `${prod.name}`

//
//if(prod.parent){
//  const p = await this.findById(prod.parent);
//  descr += p.getFullName();
//}
//
  return descr;
}
*/
export default model<IProducto>('Producto', productoSchema);
/*

[
   { parent: null, name: 'paquete', contiene: 1, precio: 10.50 }
  ,{ parent: 'paquete', name:'Pack Familiar 3', contiene: 3, precio: 30 }
  ,{ parent: 'Pack Familiar 3', name: 'Caja', contiene: 20, precio: 600 }
  ,{ parent: 'paquete', name:'Pack Familiar 5', contiene: 5, precio: 50 }
  ,{ parent: 'Pack Familiar 5', name: 'Caja', contiene: 20, precio: 1000}
]

db.testing.aggregate( [
  {
     $graphLookup: {
        from: "testing"
        ,startWith: "$parent"
        ,connectFromField: "parent"
        ,connectToField: "name"
        ,as: "reportingHierarchy"
        ,depthField: "nivel"
     }
  }
] ).pretty()


db.testing.aggregate( [
  { $match: { "name": "Caja" } },
  { $graphLookup: {
      from: "testing",
      startWith: "$parent",
      connectFromField: "parent",
      connectToField: "name",
      as: "result"
    }
  },
  { $project: {
      "name": 1,
      "connections who play golf": "$result.name"
    }
  }
] )

db.testing.aggregate( [
  { $match: { "_id": ObjectId("5f10252bff2a855720b98681") } },
  { $graphLookup: {
      from: "testing"
      ,startWith: "$parent"
      ,connectFromField: "parent"
      ,connectToField: "name"
      ,depthField: "nivel"
      ,as: "result"
    }
  }
  ,{ $project: {
    "name": 1
    , "contiene" : 1
    , "precio" : 1
    , "lista": "$result"
  }
}
] ).pretty()
*/