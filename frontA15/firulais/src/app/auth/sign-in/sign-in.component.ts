import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WhatsappSocketService } from 'src/app/services/whatsapp-socket.service';

interface iLogin {
  email?: string;
  password?: string;
}


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent {
  user:iLogin = {}
  _auth = inject(AuthService);
  _router = inject(Router);
  _wappSocket = inject(WhatsappSocketService);
  constructor() {}

  login():void {
    this._auth.signIn(this.user).subscribe(res => {
      const token:any = res;
      if(token){
        const user = this._auth.userValue;
        this._router.navigate([`/${user.group}`]);
        this._wappSocket.connect();
      }
    })
  }

  logout(){
    this._auth.logout();
    //this.newLoginEvent.emit(false)
  }

  profile(){
    this._router.navigate(['/user/profile']);
  }

}
