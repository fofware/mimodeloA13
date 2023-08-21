import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { userIsLogged } from '../users/services/users.service';
import { environment } from 'src/environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';

const URL = environment.AUTH_URL;

export interface iMenuData {
  name:string;
  title?: string;
  icon?: string;
  comment?: string;
  links: iMenuLink[];
}

export interface iMenuLink {
  icon?:string;
  title: string,
  link: string | string[],
  fragment?: string,
  roles?: string[],
  hidden?: boolean,
  outlet?: string,
  state?:any,
  target?:string,
  href?:string,
  rel?:string,
}

export const menuTop = signal<iMenuLink[]>([]);
export const menuVetical = signal<iMenuLink[]>([]);
export const menuPage = signal<iMenuData>({name:'Desconocido',links:[]});
export const menubreadcrumb = <iMenuLink[]>([]);

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  http = inject(HttpClient);
  router = inject(Router);

  getMenuP(menu:string): Promise<iMenuData> {
    return new Promise( ( resolve, reject ) => {
      try {
        this.getMenu(menu).subscribe( (res:any) => {
          resolve(res);
        })
      } catch (error) {
        console.log(error);
        reject(false)
      }
    })
  }

  getMenu(menu:string): Observable<object> {
    const logged = userIsLogged() ? `/logged` :  ``;
    return this.http.get(`${URL}/fullmenu${logged}/${menu}`);
  }

  
  readMenu(menu:string): Signal<object> {
    const logged = userIsLogged() ? `/logged` :  ``;
    return toSignal(this.http.get(`${URL}/fullmenu${logged}/${menu}`), {initialValue: {name:'Desconocido',links:[]}});
  }
}
