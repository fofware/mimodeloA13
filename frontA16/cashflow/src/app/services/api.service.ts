import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//import { ToastService } from './toast.service';
const ORI_API = environment.API_URL

export interface iToast {
  animation?: boolean,
  autohide?:boolean,
  delay?: number,
  header?: string
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  http = inject(HttpClient);
  //toast = inject(ToastService);
  get(fileName:string, data?:any, _headers={spinner: 'true'}, retError=false): Observable<any> {
    if(retError)
      return this.http.get(`${ORI_API}${fileName}`, {params: data, headers: _headers })
        .pipe(catchError( (err) => {
          this.processError(err)
          return err
        }));
    else
      return this.http.get(`${ORI_API}${fileName}`, {params: data, headers: _headers })
        .pipe(catchError( (err:HttpErrorResponse) => {
          this.processError(err)
          return EMPTY
        }));
  }
  getP(fileName:string, data?:any, _headers={spinner: 'true'}): Promise<any> {
    return new Promise((resolve, reject)=>{
      this.get(fileName, data, _headers={spinner: 'true'}, true)
      .pipe(catchError( (error) => {
        reject(error)
        return error
      }))
      .subscribe( data => {
        resolve(data);
      })
    })
  }
  post(fileName:string, data?:any, _headers={spinner: 'true'}, retError=false): Observable<any> {
    console.log("service",data)
    if(retError)
      return this.http.post(`${ORI_API}${fileName}`, data, {headers: _headers})
        .pipe(catchError( (err) => {
          this.processError(err)
          return err
        }));
    else
      return this.http.post(`${ORI_API}${fileName}`, data, {headers: _headers})
        .pipe(catchError( (err:HttpErrorResponse) => {
          this.processError(err)
          return EMPTY
        }));
  }
  postP(fileName:string, data?:any, _headers={spinner: 'true'}): Promise<any> {
    return new Promise((resolve, reject)=>{
      this.post(fileName, data, _headers={spinner: 'true'})
      .pipe(catchError( (error) => {
        reject(error)
        return error
      }))
      .subscribe( data => {
        resolve(data);
      })
    })
  }

  put(fileName:string, data?:any, _headers={spinner: 'true'}, retError=false): Observable<any> {
    //console.log("service",fileName,data);
    if(retError)
      return this.http.put(`${ORI_API}${fileName}`, data)
      .pipe(catchError( (err) => {
        this.processError(err)
        return err
      }));
    else
      return this.http.put(`${ORI_API}${fileName}`, {params: data, headers: _headers })
        .pipe(catchError( (err:HttpErrorResponse) => {
          this.processError(err)
          return EMPTY
        }));
  }

  putP(fileName:string, data?:any, _headers={spinner: 'true'}): Promise<any> {
    return new Promise((resolve, reject)=>{
      this.put(fileName, data, _headers={spinner: 'true'}, true)
      .pipe(catchError( (error) => {
        reject(error)
        return error
      }))
      .subscribe( data => {
        resolve(data);
      })
    })
  }
  delete(fileName:string, data?:any, _headers={spinner: 'true'}, retError= false): Observable<any>{
    console.log("service", fileName,)
    if(retError)
      return this.http.delete(`${ORI_API}${fileName}`,{params: data, headers: _headers })
        .pipe(catchError( err => {
          this.processError(err)
          return err;
        }));
    else
      return this.http.delete(`${ORI_API}${fileName}`,{params: data, headers: _headers })
      .pipe(catchError( (err:HttpErrorResponse) => {
        this.processError(err)
        return EMPTY
      }));
  }
  deleteP(fileName:string, data?:any, _headers={spinner: 'true'}): Promise<any> {
    return new Promise((resolve, reject)=>{
      this.delete(fileName, data, _headers={spinner: 'true'},true)
      .pipe(catchError( (error) => {
        reject(error)
        return error
      }))
      .subscribe( data => {
        resolve(data);
      })
    })
  }

  processError(res: HttpErrorResponse) {
    const options:iToast = {
      animation: true,
      autohide: true,
      delay: 5000,
    }
    let message = '';
    console.log("err",res);
    if (res.error instanceof ErrorEvent) {
      message = res.error.message;
    } else {
      message = `Error Code: ${res.status}\nMessage: ${res.message}`;
    }
    options.header = !res.error.title || res.error.title === '' ? `(${res.status}) - ${res.statusText}` : res.error.title;
    const text = !res.error.text || res.error.text === '' ? `${res.message}` : res.error.text;
    switch (res.status) {
      case 401:
        message = text;
        options.delay = 10000;

      break;
      case 404:
        message = 'Página No Existe';
        /*
        this.toastr.warning(
          text,
          title,
          {
            closeButton: true,
            disableTimeOut: true
          }
        ).onTap.pipe(take(1)).subscribe((algo) => {
          console.log(algo);
          console.log("Cerro");
        });
        */
        console.log(message)
        break;
      case 500:
        console.log(res.status,res.statusText);
        message = 'Error en el servidor'
        /*
        this.toastr.error(
          text,
          title,
          {
            closeButton: true,
            disableTimeOut: true
          }).onTap.pipe(take(1)).subscribe(() => {
            console.log("Cerro");
          })
        */
        console.log("Server Error",res);
        break;
      default:
        /*
        this.toastr.error(
          text,
          title,
          {
            closeButton: true,
            disableTimeOut: true
          }).onTap.pipe(take(1)).subscribe(() => {
            console.log("Cerro");
          })
        */
        message = 'Salio por default '+ text;
        break;
    }
    console.log('resStatus',res.status,res.statusText);
    //this.toast.show(message, options)
    return EMPTY
  }
}