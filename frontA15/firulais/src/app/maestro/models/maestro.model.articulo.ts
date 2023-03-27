import { apiResponse } from "../../models/apiResponse";

export interface maestroArticuloResponse extends apiResponse {
  rows: maestroArticuloFd[];
}

export interface maestroArticuloFd {
  _id?: string | null;
  clase: string | null;
  fabricante?: string | null;
  marca?: string | null;
  modelo?: string | null;
  especie?: string | null;
  talla?: string | null;
  edad?: string | null;
  rubro?: string | null;
  linea?: string | null;
  name?: string | null;
  fullname?: string | null;
  showName?: string[] | null;
  sText?: string[] | null;
  tags?: string[] | null;
  detalles?: string | null;
  image?:string | null;
  images?: string[] | null;
  videos?: string[] | null;
  url?: string | null;
}
