import { apiResponse } from "./apiResponse";

export interface ArticuloResponse extends apiResponse {
  rows: ArticuloFd[];
}

export interface ArticuloFd {
  beneficios: [];
  d_edad: boolean;
  d_especie: boolean;
  d_fabricante: boolean;
  d_linea: boolean;
  d_marca: boolean;
  d_raza: boolean;
  d_rubro: boolean;
  detalles: string;
  edad: string;
  especie: string;
  fabricante: string;
  formula: [];
  fullName: string;
  image: string;
  images: [];
  iva: number;
  linea: string;
  linea_id: string;
  marca: string;
  marca_id: string;
  margen: number;
  name: string;
  presentaciones: [];
  private_web: boolean;
  rubro: string;
  rubro_id: string;
  tags: string;
  url: string;
  videos: [];
  _id: string;
}
