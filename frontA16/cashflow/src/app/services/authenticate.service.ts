import { Injectable, signal } from '@angular/core';

export interface authUser {
  _id?: string;
  email?: string;
  nickname: string;
  image: string;
  apellido?: string;
  nombre?: string;
  grupo?: string;
  type?: string;
  subType?: string;
  roles: string[];
  iat: number;
  exp: number;
}

const unkonUser: authUser = {
  nickname: 'Desconocido',
  image:'/assets/images/defuser.png',
  roles:[],
  iat: 0,
  exp: 0
}

export const isLoged = signal<boolean>(false);
export const user = signal<authUser>( unkonUser );


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor() { }
}
