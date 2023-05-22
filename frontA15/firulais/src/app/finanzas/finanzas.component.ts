import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { VMenuComponent } from '../components/v-menu/v-menu.component';

@Component({
  selector: 'app-finanzas',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    VMenuComponent
  ],
  templateUrl: './finanzas.component.html',
  styleUrls: ['./finanzas.component.css']
})
export class FinanzasComponent {

}
