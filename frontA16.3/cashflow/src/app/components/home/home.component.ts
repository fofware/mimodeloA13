import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isLogged, loggedUser } from 'src/app/users/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  get loggedUser() {
    return loggedUser;
  }
  get isLogged() {
    return isLogged;
  }
}
