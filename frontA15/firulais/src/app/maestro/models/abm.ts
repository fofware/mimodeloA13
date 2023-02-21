import { apiResponse } from "../../models/apiResponse";

export interface iAbmResponse extends apiResponse {
  rows: iAbmFd[];
}

export interface iAbmFd {
  _id?: string;
  name: string;
  images?: string[];
  icons?: string[];
  selected?: boolean;
  uso?:number;
}
