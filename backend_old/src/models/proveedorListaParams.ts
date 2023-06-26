import { Schema, model, Document } from "mongoose";

export interface IProveedorListaParams extends Document {
  proveedor: string;
  fecha: string;
  
  proveedorProducto: string;
  proveedorGrupo: string;
  fchDesde: Date;
  value: number;
};
