import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, Observable, retry, throwError } from 'rxjs';
import { ToastService } from './toast.service';
import { NgbdToastComponent } from '../components/ngbd-toast/ngbd-toast.component';

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
  toastr = inject(ToastService);
  ORI_API!:string;

  public set value (v : string) {
    this.ORI_API = v;
  }

  get(fileName:string, data?:any, _headers={spinner: 'true'}, retError=false): Observable<any> {
    if(retError)
      return this.http.get(`${this.ORI_API}/${fileName}`, {params: data, headers: _headers })
        .pipe(
          catchError( (err) => {
          this.processError(err)
          return err
        }));
    else
      return this.http.get(`${this.ORI_API}/${fileName}`, {params: data, headers: _headers })
        .pipe(
          catchError( (err:HttpErrorResponse) => {
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
      return this.http.post(`${this.ORI_API}/${fileName}`, data, {headers: _headers})
        .pipe(catchError( (err) => {
          this.processError(err)
          return err
        }));
    else
      return this.http.post(`${this.ORI_API}/${fileName}`, data, {headers: _headers})
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
      return this.http.put(`${this.ORI_API}/${fileName}`, data)
      .pipe(catchError( (err) => {
        this.processError(err)
        return err
      }));
    else
      return this.http.put(`${this.ORI_API}/${fileName}`, {params: data, headers: _headers })
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
      return this.http.delete(`${this.ORI_API}/${fileName}`,{params: data, headers: _headers })
        .pipe(catchError( err => {
          this.processError(err)
          return err;
        }));
    else
      return this.http.delete(`${this.ORI_API}/${fileName}`,{params: data, headers: _headers })
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
        //message = 'No autorisado';
        options.delay = 10000;
      break;
      case 404:
        //message = 'Página No Existe';
        //options.header = `Error(${res.status}) ${res.url}`;
        this.toastr.danger('danger', options);
          /*
          {
            closeButton: true,
            disableTimeOut: true
          }*/
        /*.onTap.pipe(take(1)).subscribe((algo) => {
          console.log(algo);
          console.log("Cerro");
        });*/
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
        message = 'Salio por default ';//+ text;
        break;
    }
    console.log('resStatus',res.status,res.statusText);
    //this.toastr.show(message, options)
    return EMPTY
  }
}
