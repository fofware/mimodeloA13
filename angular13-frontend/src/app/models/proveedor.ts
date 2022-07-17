export interface ProveedorProductoResponse {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number;
  sort: object;
  count: number;
  apiTime: number;
  filter: object;
  rows: ProveedorProductoFd[];
  message: string;
}

export interface ProveedorProductoFd {
  _id?: string;
  proveedor: any;
  articulo: any;
  presentacion: any;
  codigo?: string;
  names?: string[];
}
