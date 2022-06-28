import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
// https://www.bezkoder.com/angular-13-jwt-auth/
// https://www.positronx.io/protect-angular-routes-with-canactivate-guard-for-firebase-users/
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private authSrv: AuthService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): 
      Observable<boolean> {
        let usr:any = {}
        console.log("route", route.data['roles']);
        usr = this.authSrv.userValue
        console.log(usr);

      //console.log("state",state);
      console.log(this.authSrv.isLogged)
    return this.authSrv.isLogged;
  }
  
}
