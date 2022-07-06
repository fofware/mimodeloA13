import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, Observer, retry, throwError } from 'rxjs';
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

  get(fileName:string, data?:any, _headers={spinner: 'true'}): Observable<any> {
    console.log("service",fileName,data)
    return this.http.get(`${ORI_API}${fileName}`, {params: data, headers: _headers });
  }

  post(fileName:string, data?:any, _headers={spinner: 'true'}) {
    console.log("service",data)
    return this.http.post(`${ORI_API}${fileName}`, data, {headers: _headers});
  }

  leer(fileName:string) {
    return this.http.get(`${ORI_API}${fileName}`).pipe(retry(1), catchError(this.processError));
  }

  delete(fileName:string, _headers={spinner: 'true'}){
    console.log("service", fileName,)
    return this.http.delete(`${ORI_API}${fileName}`,{ headers: _headers })
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
