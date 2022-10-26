import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-articulo-form-articulo-edit',
  templateUrl: './articulo-form-articulo-edit.component.html',
  styleUrls: ['./articulo-form-articulo-edit.component.css']
})
export class ArticuloFormArticuloEditComponent implements OnInit {
 
  @Input() articulo:any;
 
  constructor() { }

  ngOnInit(): void {
  }

}
