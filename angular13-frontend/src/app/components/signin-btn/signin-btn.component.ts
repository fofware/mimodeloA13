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
    this.user = this.authService.decodeToken(token);
  }

  login(myDrop:any){
    console.log('login');
    this.authService.signIn(this.user).subscribe(res => {
      const token:any = res;
      localStorage.setItem('token', token );
      this.user = this.authService.decodeToken(token);
      myDrop.close();
    })
  }

  isLogged(){
    const d = new Date().getTime()/1000;
    if (this.user.exp && d>this.user.exp){
      this.logout();
    }

    return d<this.user.exp;
  }
  logout(){
    localStorage.removeItem('token');
    this.user = this.authService.decodeToken();
  }
}
