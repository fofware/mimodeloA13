import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = environment.AUTH_URL;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  public get user(): any {
    const token = localStorage.getItem('token');
    if (token && token !== null ) {
      const jwtToken = JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
      const d = new Date().getTime();
      //console.log ("expired", d <= jwtToken.exp);
      //console.log(d-jwtToken.exp);
      //console.log("tocken",jwtToken);
      //console.log("Now",d);
      if (jwtToken.exp <= d){
        return jwtToken;
      }
      localStorage.removeItem('token');
    }
    return {
      nickname: 'Anónimo',
      image: '/assets/images/defuser.png',
      iat: 0,
      exp: 0
    };
  }

  decodeToken(token?:any){
    if (token && token !== null ) {
      const jwtToken = JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
      const d = new Date().getTime()/1000;
      //console.log ("expired", d >= jwtToken.exp);
      //console.log(d)
      //console.log(jwtToken.exp)
      //console.log(jwtToken.exp-d);
      ////console.log("tocken",jwtToken);
      //console.log("Now",d);
      if (jwtToken.exp >= d){
        return jwtToken;
      }
      localStorage.removeItem('token');
    }
    return {
      nickname: 'Anónimo',
      image: '/assets/images/defuser.png',
      iat: 0,
      exp: 0
    };

  }
  signIn( user: any ): Observable<object> {
    return this.httpClient.post(this.URL + '/signin', user);
  }

  signUp( user: string ): Observable<object>  {
    return this.httpClient.post(this.URL + '/signup', user);
  }

  getToken(): string | null{
    const token = localStorage.getItem('token');
    return token;
  }

  async emailExists(email:string): Promise<boolean> {
    console.log(email);
    const rpta:any = await this.httpClient.get(`${this.URL}/emailcheck/${email}`).toPromise();
    console.log(rpta);
    return rpta.exists
  }

  async emailFind(email:string): Promise<[string]> {
    console.log(email);
    const rpta:any = await this.httpClient.get(`${this.URL}/emailcheck/${email}`).subscribe( (res) => {
      return res;
    });
    console.log(rpta);
    return rpta
  }

  loggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token && token !== null ) {
      const jwtToken = JSON.parse(atob(token.split('.')[1]));
      // set a timeout to refresh the token a minute before it expires
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      if ( timeout > 10000 ) { return true; }
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate([`auth/signin`]);
  }

  //getUser(): any {
  //  const token = localStorage.getItem('token');
  //  if (token && token !== null ) {
  //    const jwtToken = JSON.parse(atob(token.split('.')[1]));
  //    return jwtToken
  //  }
  //  return false;
  //}
/*
  public getUserRoless(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}getUserRoles`)
      .pipe(catchError((error: any, caught: any) => {
          reject(error);
          return caught;
        }),
        map((res: any) => res.data))
      .subscribe((role: string[]) => {
        resolve(role);
      });
    });
   }
*/
  profile(): void {
    this.router.navigate(['/private/profile']);
  }
}
