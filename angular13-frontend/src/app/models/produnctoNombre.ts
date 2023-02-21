import { apiResponse } from "./apiResponse";

export interface prodName {
    _id: string;
    articulo: any;
    fabricante: any;
    marca: any;
    rubro: any;
    linea: string;
    especie: string;
    edad: string;
    raza: string;
    contiene: number;
    ean: string;
  
    fullname: string;
    art_name: string;
    prodName: string;
    image: string;
    oferta: boolean;
    oferta_desde: any;
    oferta_hasta: any;
    oferta_precio: number;
    pCompra: boolean;
    pVenta: boolean;
    plu: number;
    precio: number;
    stock: number;
    tags: string;
    unidad: string;
  }
  
  export interface prodNameResponse extends apiResponse {
    rows: prodName[];
  }
  