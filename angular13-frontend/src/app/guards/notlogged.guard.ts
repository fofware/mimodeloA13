import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotloggedGuard implements CanActivate {
  constructor(private authSrv: AuthService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    console.log('ActivatedRouteSnapshot', route);
    console.log('RouterStateSnapshot',state);
    return this.authSrv.isLogged.pipe(
      take(1),
      map((isLogged:boolean) => !isLogged)
    );
  }
  
}
