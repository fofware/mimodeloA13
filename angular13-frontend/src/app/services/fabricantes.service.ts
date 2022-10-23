import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FabricantesService {

  constructor(private apiSrv: ApiService) { }

  list() {
    return this.apiSrv.leer('/fabricantes');
  }

}
