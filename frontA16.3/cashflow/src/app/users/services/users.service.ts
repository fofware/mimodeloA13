import { Injectable, inject, signal } from '@angular/core';
import { userAlertMsg } from './interfaces/user.alerts';
import { User, unknowUser } from './interfaces/user';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { iTopMenu } from 'src/app/components/top-menu/top-menu.component';
import { dataSocketService } from 'src/app/services/socket.service';

const URL = environment.AUTH_URL;

export const userAlerts = signal<userAlertMsg[]>([]);
export const userIsLogged = signal<boolean>(false);
export const userLogged = signal<User>(unknowUser);
export const userTopMenu = signal<iTopMenu[]>([]);
export const userVMenu = signal<iTopMenu[]>([]);

@Injectable({
  providedIn: 'root'
})


export class UsersService {
  http = inject(HttpClient);
  router = inject(Router);
  skt = inject(dataSocketService);

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
        map( async (res:any) => {
          this.saveToken(res);
          this.decodeToken(res);
          userTopMenu.set(await this.getVMenuP('topMenu'));
          //this.skt.connect();
          //this._socket.connect();s
          return res
        })
      );
  }

  signInP( user: any ): Promise<object> {
    return new Promise( async (resolve, reject) => {
      this.signIn(user).subscribe( res => {
        resolve(res);
      })
      /*
      try {
        this.http
        .post(`${URL}/signin`, user)
        .subscribe( async (res:any) => {
          this.saveToken(res);
          this.decodeToken(res);
          userTopMenu.set(await this.getVMenuP('topMenu'));
          resolve(res);
        })
      } catch (error) {
        console.log(error);
      }
      */
    })
  }

  getVMenuP(menu:string): Promise<iTopMenu[]> {
    return new Promise( ( resolve, reject ) => {
      try {
        this.getvMenu(menu).subscribe( (res:any) => {
          resolve(res);
        })
      } catch (error) {
        console.log(error);
        reject(false)
      }
    })
  }

  getvMenu(menu:string): Observable<object> {
    const logged = userIsLogged() ? `/logged` :  ``;

    return this.http.get(`${URL}/usermenu${logged}/${menu}`);
  }
/*
  getTopMenuP(): Promise<iTopMenu[]> {
    return new Promise( ( resolve, reject ) => {
      try {
        this.getTopMenu().subscribe( (res:any) => {
          resolve(res);
        })
      } catch (error) {
        console.log(error);
        reject(false)
      }
    })
  }
*/
/*
  getTopMenu(): Observable<object> {
    const logged = userIsLogged() ? `/logged` :  ``;
    return this.http.get(`${URL}/usermenu${logged}`);
  }
*/
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

  async logout() {
    this.skt.disconnect();

    localStorage.removeItem('token');
    userAlerts.set([]);
    userLogged.set(unknowUser);
    userIsLogged.set(false);
    userTopMenu.set(await this.getVMenuP('topMenu'));
    this.router.navigate([``]);
  }

  profile(): void {
    this.router.navigate(['/private/profile']);
  }
}
