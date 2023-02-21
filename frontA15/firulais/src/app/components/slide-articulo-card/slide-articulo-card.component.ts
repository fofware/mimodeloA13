import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-slide-articulo-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './slide-articulo-card.component.html',
  styleUrls: ['./slide-articulo-card.component.css']
})
export class SlideArticuloCardComponent {
  @Input() articulo: any;

}
