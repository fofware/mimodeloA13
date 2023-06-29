import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MpMenuComponent } from './mp-menu/mp-menu.component';

@Component({
  selector: 'app-mp',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MpMenuComponent
  ],
  templateUrl: './mp.component.html',
  styleUrls: ['./mp.component.css']
})
export class MpComponent {
  links = [
    { title: 'Inicio', route: './', param: 'inicio' },
    { title: 'Credenciales', route: './', param: 'credenciales'  },
  ];
}
