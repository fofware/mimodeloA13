import { apiResponse } from "./apiResponse";

export interface ProveedorProductoFd {
  _id?: string;
  proveedor: any;
  articulo: any;
  presentacion: any;
  codigo?: string;
  names?: string[];
}

export interface ProveedorProductoResponse extends apiResponse{
  rows: ProveedorProductoFd[];
}
