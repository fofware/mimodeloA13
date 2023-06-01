import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userIsLogged, userLogged } from 'src/app/users/services/users.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  get loggedUser() {
    return userLogged;
  }
  get isLogged() {
    return userIsLogged;
  }
}
