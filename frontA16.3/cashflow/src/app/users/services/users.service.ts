import { Injectable, inject, signal } from '@angular/core';
import { userAlertMsg } from './interfaces/user.alerts';
import { User, unknowUser } from './interfaces/user';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

const URL = environment.AUTH_URL;

export const userAlerts = signal<userAlertMsg[]>([]);
export const userIsLogged = signal<boolean>(false);
export const userLogged = signal<User>(unknowUser);


@Injectable({
  providedIn: 'root'
})


export class UsersService {
  http = inject(HttpClient);
  router = inject(Router);

  constructor() {
    this.getToken();
  }

  decodeToken(token:any = null){
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
        userLogged.set(jwtToken);
        userIsLogged.set(true);
        return jwtToken;
      }
      localStorage.removeItem('token');
    }
    userLogged.set(unknowUser);
    userIsLogged.set(false);
    return unknowUser;
  }

  signIn( user: any ): Observable<object> {
    return this.http
      .post(`${URL}/signin`, user)
      .pipe(
        map( (res:any) => {
          this.saveToken(res);
          this.decodeToken(res);
          //userLogged.set(this.decodeToken(res));
          //this._socket.connect();
          return res
        })
      );
  }

  signUp( user: object ): Observable<object>  {
    return this.http.post(`${URL}/signup`, user);
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
    const rpta:any = await this.http.get(`${URL}/emailcheck/${email}`).toPromise();
    console.log(rpta);
    return rpta.exists
  }

  emailFind(email:string): Observable<boolean> {
    return this.http
      .get(`${URL}/emailcheck/${email}`)
      .pipe(map( (x:any) => {
        if (x.exists) return true;
        else return  false;
      }))
  }

  logout(): void {
    localStorage.removeItem('token');
    userAlerts.set([]);
    userIsLogged.set(false);
    userLogged.set(unknowUser);
    this.router.navigate([``]);
  }

  profile(): void {
    this.router.navigate(['/private/profile']);
  }
}
