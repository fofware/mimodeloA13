import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { finalize, Observable, retry, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  spinnerCount = 0;
  enabled = false;
  constructor(
    private spinner: NgxSpinnerService,
    public toastr: ToastrService
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const enabled = request.headers.get('spinner');
    this.enabled = enabled && enabled === 'false' ? false : true;
    //console.log('Interceptor spinner', enabled, this.enabled )
    //if (this.spinnerCount === 0 && this.enabled) this.spinner.show();
    //this.spinnerCount++;
    return next.handle(request).pipe(
      retry(1),
      catchError( res => {
        console.log(res);
        const title = !res.error.title || res.error.title === '' ? `(${res.status}) - ${res.statusText}` : res.error.title;
        const text = !res.error.text || res.error.text === '' ? `${res.message}` : res.error.text;
        switch (res.status) {
          case 200:
            this.toastr.info('Todo Bien','Api');
            break;
          case 401:
            this.toastr.warning( text, title );
            //this.auth.logout();
            console.log("No esta logueado")
            console.log(res)
            break;
          case 404:
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
            break;
          case 500:
            this.toastr.error(
              text,
              title,
              {
                closeButton: true,
                disableTimeOut: true
              }).onTap.pipe(take(1)).subscribe(() => {
                console.log("Cerro");
              })
            console.log("Default Error",res);
            break;
          default:
            this.toastr.error(
              text,
              title,
              {
                closeButton: true,
                disableTimeOut: true
              }).onTap.pipe(take(1)).subscribe(() => {
                console.log("Cerro");
              })
            console.log("Default Error",res);
            break;
        }
        return throwError(() => new Error('test'));
      }),
      finalize( () => {
        //this.spinnerCount--;
        //if(this.spinnerCount === 0) this.spinner.hide();
      })
    );
  }
}
