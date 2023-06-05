import { HttpInterceptorFn } from "@angular/common/http"
import { catchError, EMPTY, finalize, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const isApiUrl = req.url.startsWith(environment.API_URL);
  if (token && isApiUrl) {
    //req = req.clone({
    //  setHeaders: { Authorization: `Bearer ${token}` }
    //});
    const headers = req.headers.set('Authorization', `Bearer ${token}`);
    req = req.clone({
        headers
    });
  }
  return next(req);
  /*
  .pipe(
    tap(res => console.log('response', res)),
    catchError( res => {
      console.log(res)
      return EMPTY;
      return throwError(() => res)
    })

  );
  */
}


