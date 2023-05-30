export interface ResponseUser {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number | boolean;
  sort: {};
  count: number;
  apiTime: number;
  filter: {};
  message: string;
  rows?: User[];
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  nombre: string;
  apellido: string;
}
