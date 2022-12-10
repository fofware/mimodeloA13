import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-productos-card',
  templateUrl: './productos-card.component.html',
  styleUrls: ['./productos-card.component.css']
})
export class ProductosCardComponent implements OnInit {
  @Input() producto: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.producto)
  }

}
