import { Injectable, Signal, inject, signal } from '@angular/core';
import { userAlertMsg } from './interfaces/user.alerts';
import { User, logInUser, unknowUser } from './interfaces/user';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { iTopMenu } from 'src/app/components/top-menu/top-menu.component';
import { dataSocketService } from 'src/app/services/socket.service';
import { ToastService } from 'src/app/services/toast.service';
import { toSignal } from '@angular/core/rxjs-interop';

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
  toast = inject(ToastService);

  constructor() {
    //this.getToken();
  }

  async decodeToken(token:any = null){
    if (token && token !== null ) {
      const jwtToken = JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
      const d = new Date().getTime()/1000;
      if (jwtToken.exp >= d){
        userLogged.set(jwtToken);
        userIsLogged.set(true);
        userTopMenu.set(await this.getVMenuP('topMenu'));
        userVMenu.set(await this.getVMenuP('usersHome'));
        return jwtToken;
      }
      localStorage.removeItem('token');
    }
    userLogged.set(unknowUser);
    userIsLogged.set(false);
    userTopMenu.set(await this.getVMenuP('topMenu'));
    userVMenu.set([]);
    return unknowUser;
  }

  async processToken (token:string){
    this.saveToken(token);
    this.decodeToken(token);
    if(userIsLogged() && userLogged().emailvalidated){
      userTopMenu.set(await this.getVMenuP('topMenu'));
    }
  }

  signIn( user: logInUser ): Observable<object> {
    return this.http
      .post(`${URL}/signin`, user)
      .pipe(
        map( async (res:any) => {
          this.processToken(res);
          /*
          this.saveToken(res);
          this.decodeToken(res);
          if(userIsLogged() && userLogged().emailvalidated){
            userTopMenu.set(await this.getVMenuP('topMenu'));
          }
          */
          //this.skt.connect();
          //this._socket.connect();
          return res
        })
      );
  }

  signInP( user: any ): Promise<object> {
    return new Promise( async (resolve, reject) => {
      this.signIn(user).subscribe( res => {
        resolve(res);
      });
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
    });
  }

  signInS(logInUser: logInUser): Signal<object>  {
    return toSignal(this.signIn(logInUser),{initialValue: unknowUser});
  }

  confirmEmail(data:any): Observable<object> {
    return this.http
    .post(`${URL}/confirm/email`, data)
    .pipe(
      map( (res:any) => {
        console.log(res)
        //await this.processToken(res.token);
        return res
      })
    );
  }

  newConfirmEmail(): Observable<object> {
    return this.http
    .get(`${URL}/comfirm/email/new`)
    .pipe(
      map( (res:any) => {
        const header = `Nuevo Código Generado`;
        this.toast.info( `Lea su correo para obtener el código generado`, { header, delay: 5000, autohide: false })
        //this.toast.success( `Lea su correo para obtener el código generado`, { header, delay: 5000, autohide: false })
        console.log('newComfirmEmail',res)
        return res
      })
    );
  }

  newResetPassworCode(data:any){
    return this.http.post(`${URL}/pass/rst/code/new`,data);
  }
  cambiarClave(data:any){
    return this.http.post(`${URL}/pass/change`,data);
    //return this.http
    //  .post(`${URL}/pass/change`,data)
    //  .pipe(
    //    map( async (res:any) => {
    //      this.processToken(res);
    //      //this.skt.connect();
    //      //this._socket.connect();
    //      return res
    //    })
    //  );
  }
  confirmResetPassworCode(data:any){
    return this.http.post(`${URL}/pass/rst/code/verify`,data);
  }
  savePassword(data:logInUser) {
    return this.http.post(`${URL}/pass/rst`,data)
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
  resetPassword(data: object): Observable<boolean> {
    return this.http.post<boolean>(`${URL}/resetpassword`, data);
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
    this.router.navigate([`/`]).then( nav => {
      window.location.reload();
    });
  }

  profile(): void {
    this.router.navigate(['/private/profile']);
  }
}
