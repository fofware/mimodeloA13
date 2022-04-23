import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

const ORI_API = environment.API_URL
//const ORI_API = 'https://firulais.net.ar/api/'
//const ORI_API = 'http://desktop.firulais.net.ar:4400/api/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor( private http: HttpClient ) { 
  }

  //leer(fileName:string) {
  //  return this.http.get(`${ORI_API}/${fileName}`);
  //}

  leer(fileName:string) {
    return this.http.get(`${ORI_API}${fileName}`).pipe(retry(1), catchError(this.processError));
  }

  processError(err: any) {
    let message = '';
    if (err.error instanceof ErrorEvent) {
      message = err.error.message;
    } else {
      message = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    console.log(message);
    return throwError(() => {
      message;
    });
  }
}
