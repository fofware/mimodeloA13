import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MasterdataService extends ApiService{

  constructor() {
    super();
    this.ORI_API = 'https://api.vta.ar'
  }

}
