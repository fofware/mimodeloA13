import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { UsersService, userAlerts, userIsLogged, userLogged } from '../../services/users.service';

@Component({
  selector: 'app-user-btn',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbDropdownModule
  ],
  templateUrl: './user-btn.component.html',
  styleUrls: ['./user-btn.component.scss']
})

export class UserBtnComponent implements AfterViewInit {
  @ViewChild('myDrop', { static: true }) myDrop!: NgbDropdown;
  user = {
    email: '',
    password: ''
  }

  _user = inject(UsersService);
  _router = inject(Router)

  ngOnInit(){
  }
  ngAfterViewInit(){
    /*
    if(userIsLogged() && !userLogged().emailvalidated){
      this.myDrop.open();
      console.log("userLogged", userLogged())
    }
    */
  }
  ngOnDestroy(): void {
  }

  async login(myDrop:any) {
    this._user.signIn(this.user).subscribe(res => {
      myDrop.close();
      console.log('Login',res);
      this._router.navigateByUrl(`users`);
    })
  }
  changePassword(){
    console.log('Chage password');
    this._router.navigate(['/users/changepass'])
  }

  logout(){
    this._user.logout();
  }

  cuenta(){
    this._router.navigate(['/users'])
  }

  profile(){
    this._router.navigate(['/users/profile']);
  }

  validateEmail(){
    this._router.navigate(['/users']);
  }
  get _loggedUser(){
    return userLogged;
  }
  get isLogged(){
    return userIsLogged;
  }
  get alerts(){
    return userAlerts;
  }
}
