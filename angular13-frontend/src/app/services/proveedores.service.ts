import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  proveedores = [
    { id:'1', name:"Angular"},
    { id:'2', name:'Pepe'}
  ];

  constructor() { }

  get(id?:any){
    if(id) return this.proveedores[id-1];
    return this.proveedores;
  }
}
