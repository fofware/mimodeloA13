import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-articulos-card',
  templateUrl: './articulos-card.component.html',
  styleUrls: ['./articulos-card.component.css']
})
export class ArticulosCardComponent implements OnInit {
  @Input() articulo: any;
  constructor() { }

  ngOnInit(): void {
  }

}
