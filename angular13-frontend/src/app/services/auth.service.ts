import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = environment.AUTH_URL;
  private noTken = {
    nickname: 'Anónimo',
    image: '/assets/images/defuser.png',
    roles: ['visitante'],
    iat: 0,
    exp: 0
  }
  private logged = new BehaviorSubject<boolean>(false);
  private loggedUsr = new BehaviorSubject<object>(this.noTken);
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { 
    this.decodeToken(this.getToken())
  }
  
  get isLogged(): Observable<boolean>{
    return this.logged.asObservable();
  }
  
  public get isLoggedValue(): boolean {
    return this.logged.value;
  }
  
  public get userValue(): any {
    return this.loggedUsr.value;
  }
  
  public get user(): Observable<any> {
    return this.loggedUsr.asObservable();
  }

  decodeToken(token:any = null){
    if (token && token !== null ) {
      const jwtToken = JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
      const d = new Date().getTime()/1000;
      if (jwtToken.exp >= d){
        this.loggedUsr.next(jwtToken);
        this.logged.next(true)
        return jwtToken;
      }
      localStorage.removeItem('token');
    }
    this.loggedUsr.next(this.noTken);
    this.logged.next(false);
    return this.noTken;
  }

  signIn( user: any ): Observable<object> {
    return this.httpClient
      .post(this.URL + '/signin', user)
      .pipe(
        map( (res:any) => {
          this.saveToken(res);
          this.decodeToken(res);
          return res
        })
      );
  }

  signUp( user: string ): Observable<object>  {
    return this.httpClient.post(this.URL + '/signup', user);
  }

  saveToken(token:string){
    localStorage.setItem('token',token)
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

/*
async checkEmail(){
    this.alertService.clear();
    console.log(this.form.value.email)
    const exists = await this.authService.emailExists(this.form.value.email);
    console.log(this.form);
    if(exists){
      this.alertService.error('Email ya está registrado');

    }
  }
*/

  async emailFind(email:string): Promise<[string]> {
    console.log(email);
    const rpta:any = this.httpClient.get(`${this.URL}/emailcheck/${email}`).subscribe((res) => {
      return res;
    });
    console.log(rpta);
    return rpta
  }

  logout(): void {
    localStorage.removeItem('token');
    this.logged.next(false)
    this.loggedUsr.next(this.noTken);
    this.router.navigate([``]);
  }

  profile(): void {
    this.router.navigate(['/private/profile']);
  }
}
