import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-articulo-list-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './articulo-list-card.component.html',
  styleUrls: ['./articulo-list-card.component.css']
})
export class ArticuloListCardComponent {
  @Input() articulo: any;
  constructor(){}
}
