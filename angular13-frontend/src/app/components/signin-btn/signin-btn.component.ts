import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin-btn',
  templateUrl: './signin-btn.component.html',
  styleUrls: ['./signin-btn.component.css']
})
export class SigninBtnComponent implements OnInit {
  user:any = {};

  constructor(public authService: AuthService ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
  
    this.user = this.authService.decodeTocken(token);
    console.log(this.user)
  }

}