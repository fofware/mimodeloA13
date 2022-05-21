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

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinner.show();
    console.log(request);
    return next.handle(request).pipe(
      retry(1),
      catchError( error => {
        console.log(error);
        switch (error.status) {
          case 200:
            this.toastr.info('Todo Bien','Api');
            break;
          case 401:
            this.toastr.info('No está autorizado','Debe autenticarse');
            //this.auth.logout();
            console.log("No esta logueado")
            break;
          case 404:
            this.toastr.warning(
              error.message,
              error.statusText,
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
              error.message,
              error.statusText,
              {
                closeButton: true,
                disableTimeOut: true
              }).onTap.pipe(take(1)).subscribe(() => {
                console.log("Cerro");
              })
            console.log("Default Error",error);
            break;
          default:
            this.toastr.error(
              error.message,
              error.statusText,
              {
                closeButton: true,
                disableTimeOut: true
              }).onTap.pipe(take(1)).subscribe(() => {
                console.log("Cerro");
              })
            console.log("Default Error",error);
            break;
        }
        return throwError(error);
      }),
      finalize( () => {
        this.spinner.hide();
      })
    );
  }
}
