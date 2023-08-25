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
  id?: string;
  email?: string;
  emailvalidated?: boolean;
  nickname: string;
  image: string;
  nombre?: string;
  apellido?: string;
  exp?: number;
  iat?: number;
  roles: string[];
  subType?: string;
  type?: string;
}

export const unknowUser: User = {
  nickname: 'Visitante',
  image: '/assets/images/defuser.png',
  roles: []
}
