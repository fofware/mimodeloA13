import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
//import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { User } from './interfaces/user';
//import { WhatsappSocketService } from './whatsapp-socket.service';

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
  menu?: [];
  roles: string[];
  iat: number;
  exp: number;
}

export const decodeToken = (token:string | null ): authUser => {
  if(!token) return {
    nickname: 'Anónimo',
    image: '/assets/images/defuser.png',
    roles: ['visitante'],
    iat: 0,
    exp: 0
  }
  return JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join('')));
}

const noTken = {
  nickname: 'Anónimo',
  image: '/assets/images/defuser.png',
  roles: ['visitante'],
  iat: 0,
  exp: 0
}

export const isLogged = signal<boolean>(false);
export const loggedUser = signal<authUser>(noTken);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL = environment.AUTH_URL;
  http = inject(HttpClient);
  router = inject(Router);
  //_wappSocket = inject(WhatsappSocketService);
  //api = inject(ApiService);

  constructor() {
  }

  decodeToken(token:any = null){
    console.log(token);

    if (token && token !== null ) {
      const jwtToken = JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
      const d = new Date().getTime()/1000;
      if (jwtToken.exp >= d){
        const rol = jwtToken.roles[0];
        const type = rol.split('_');
        jwtToken['type'] = type[0];
        jwtToken['subType'] = type[1];
        //this.loggedUsr.next(jwtToken);
        isLogged.set(true);
        console.log(jwtToken);
        return jwtToken;
      }
      localStorage.removeItem('token');
    }
    //this.loggedUsr.next(this.noTken);
    isLogged.set(false);
    return noTken;
  }

  signIn( user: any ): Observable<object> {
    return this.http
      .post(this.URL + '/signin', user)
      .pipe(
        map( (res:any) => {
          console.log(res);
          //this.saveToken(res);
          loggedUser.set(this.decodeToken(res));
          //this._socket.connect();
          return res
        })
      );
  }

  signUp( user: object ): Observable<object>  {
    return this.http.post(this.URL + '/signup', user);
  }

  saveToken(token:string){
    localStorage.setItem('token',token);
  }

  getToken(): string | null{
    const token = localStorage.getItem('token');
    return token;
  }

  async emailExists(email:string): Promise<boolean> {
    console.log(email);
    const rpta:any = await this.http.get(`${this.URL}/emailcheck/${email}`).toPromise();
    console.log(rpta);
    return rpta.exists
  }

  emailFind(email:string): Observable<boolean> {
    return this.http
      .get(`${this.URL}/emailcheck/${email}`)
      .pipe(map( (x:any) => {
        if (x.exists) return true;
        else return  false;
      }))
  }

  logout(): void {
    localStorage.removeItem('token');
    isLogged.set(false);
    loggedUser.set(noTken);
    //this.loggedUsr.next(this.noTken);
    this.router.navigate([``]);
    //this._wappSocket.disconnect();
  }

  profile(): void {
    this.router.navigate(['/users/']);
  }
}
