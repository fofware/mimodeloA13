import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
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
export class UserBtnComponent {
  user = {
    email: '',
    password: ''
  }

  _authService = inject(UsersService);
//  _activatedRoute = inject(ActivatedRoute);
  _router = inject(Router)

//  @Output() newLoginEvent = new EventEmitter<boolean>()

//  private destroy$ = new Subject<any>();

  ngOnInit(){
    /*
    this._authService.isLogged
        .pipe( takeUntil(this.destroy$) )
        .subscribe( res => {
          this.isLogged = res;
          //this.user = this.authService.userValue;
          this.newLoginEvent.emit(res);
        });
    */
  }

  ngOnDestroy(): void {
//    this.destroy$.next({});
//    this.destroy$.complete();
  }

  login(myDrop:any):void {
    console.log(this.user)

    this._authService.signIn(this.user).subscribe(res => {
      const token:any = res;
      myDrop.close();
      //this._router.navigate([`/${user.group}`],)
      //this._router.navigate([`/users/`],)
      this._router.navigateByUrl(`users`)
    })

  }

  logout(){
    this._authService.logout();
  }

  profile(){
    //this._router.navigate(['/user/profile']);
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
