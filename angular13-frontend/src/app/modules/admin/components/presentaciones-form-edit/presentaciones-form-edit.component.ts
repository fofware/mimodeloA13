import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-presentaciones-form-edit',
  templateUrl: './presentaciones-form-edit.component.html',
  styleUrls: ['./presentaciones-form-edit.component.css']
})
export class PresentacionesFormEditComponent implements OnInit {
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
