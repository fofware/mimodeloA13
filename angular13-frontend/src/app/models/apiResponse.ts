export interface apiResponse {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number;
  sort: object;
  count: number;
  apiTime: number;
  filter: object;
  message: string;
}

