import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private apiSrv: ApiService) { }

  findUserByEmail(email:string){
    return this.apiSrv.get(`/user/email/${email}`)
  }
}
