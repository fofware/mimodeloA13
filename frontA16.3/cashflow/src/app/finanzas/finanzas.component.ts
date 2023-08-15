import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-finanzas',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './finanzas.component.html',
  styleUrls: ['./finanzas.component.scss']
})
export class FinanzasComponent {

}
