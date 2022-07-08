export interface MarcaResponse {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number;
  sort: object;
  count: number;
  apiTime: number;
  filter: object;
  data: MarcaFd[];
  message: string;
}

export interface MarcaFd {
  _id: string;
  name: string;
  fabircante: string;
  images: any[];
}
