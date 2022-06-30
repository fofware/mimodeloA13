import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(private apiSrv: ApiService) {}

  list() {
    return this.apiSrv.leer('/proveedores');
  }

  get(id?:any){
    return this.apiSrv.get(`/proveedor/${id}`);
  }

}
