import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-articulo-form-presentaciones-edit',
  templateUrl: './articulo-form-presentaciones-edit.component.html',
  styleUrls: ['./articulo-form-presentaciones-edit.component.css']
})
export class ArticuloFormPresentacionesEditComponent implements OnInit {
  @Input() presentacion:any;
  @Input() articulo:any;
  @Input() unidades:any;

  @Input() idx:number | undefined;
  constructor() { }

  ngOnInit(): void {
    console.log(this.presentacion);
    console.log(this.unidades);
  }
  borrar(){
    console.log('borrar');
  }
}
