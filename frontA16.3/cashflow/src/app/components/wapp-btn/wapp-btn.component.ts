import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isLogged } from 'src/app/users/services/auth.service';

@Component({
  selector: 'app-wapp-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wapp-btn.component.html',
  styleUrls: ['./wapp-btn.component.scss']
})
export class WappBtnComponent {
  get _isLogged(){
    return isLogged;
  }
}
