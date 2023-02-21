import { apiResponse } from "./apiResponse";

export interface FabricanteResponse extends apiResponse {
  rows: FabricanteFd[];
}

export interface FabricanteFd {
  _id?: string;
  name: string;
  marcas?: [];
  images?: string[];
}
