import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VMenuComponent } from '../components/v-menu/v-menu.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    RouterOutlet,
    VMenuComponent
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

}
