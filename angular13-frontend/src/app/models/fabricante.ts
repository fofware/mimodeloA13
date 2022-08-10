export interface Fabricante {
}
export interface FabricanteResponse {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number;
  sort: object;
  count: number;
  apiTime: number;
  filter: object;
  rows: FabricanteFd[];
  message: string;
}

export interface FabricanteFd {
  _id: string;
  name: string;
  marcas: [];
  images: any[];
}
