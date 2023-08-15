import { HttpInterceptorFn } from "@angular/common/http"
import { environment } from "src/environments/environment";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const isApiUrl = req.url.startsWith(environment.API_URL);
  if (token && isApiUrl) {
    const headers = req.headers.set('Authorization', `Bearer ${token}`);
    req = req.clone({
        headers
    });
  }
  return next(req);
  //  aca va la parte del refresTocken con un pipe y cachError
}


