import { HttpInterceptorFn, HttpResponse } from "@angular/common/http"
import { inject } from "@angular/core";
import { catchError, EMPTY, finalize, take, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { ToastService } from 'src/app/services/toast.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiUrl = req.url.startsWith(environment.API_URL);
  const spinner = req.headers.get('spinner');
  const enabled = spinner && spinner === 'false' ? false : true;

  return next(req)
    .pipe(
      /*
      tap( (res: any)  => {
        console.log('response', res);
        console.log(res.status, res.statusText)
      }),
      */
      catchError( res => {
        let message =''
        let code = res.status;
        console.log(res);
        const title = !res.error.title || res.error.title === '' ? `(${res.status}) - ${res.statusText}` : res.error.title;
        const text = !res.error.text || res.error.text === '' ? `${res.message}` : res.error.text;
        switch (res.status) {
          case 401:
            //this.auth.logout();
            code = res.status;
            message = 'No está Logueado'
            console.log("No esta logueado")
            break;
          case 404:
            console.log(res.status,res.statusText);
            code = res.status;
            message = 'Página No Existe';
/*
            toastr.warning(
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
            message = 'Salio por default'
            console.log("Default Error",res);
            console.log(res.status,res.statusText);
            console.log(message)
            break;
        }
        console.log(res.status,res.statusText);
        return EMPTY;

        return throwError(() => new Error(message));
      }),
      finalize( () => {
        //this.spinnerCount--;
        //if(this.spinnerCount === 0) this.spinner.hide();
      })
    )
}

