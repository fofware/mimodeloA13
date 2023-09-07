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
export interface logInUser {
  email: string;
  password: string;
}

export interface User {
  id?: string;
  email?: string;
  emailvalidated?: boolean;
  nickname?: string;
  showname: string;
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
  showname: 'Visitante',
  image: '/assets/images/defuser.png',
  roles: []
}
