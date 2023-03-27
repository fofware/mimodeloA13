export interface apiResponse {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number | boolean;
  sort: {};
  count: number;
  apiTime: number;
  filter: {};
  message: string;
  rows?: any;
}
