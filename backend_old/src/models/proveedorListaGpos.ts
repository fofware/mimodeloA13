import { Schema, model, Document } from "mongoose";

export interface IProveedorListaParams extends Document {
  proveedor: string;
  fecha: string;
  name: string;
  cantidad: number;
  coeficiente: number;
};
