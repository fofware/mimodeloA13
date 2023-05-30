import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, isLogged, loggedUser } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

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

  _authService = inject(AuthService);
//  _activatedRoute = inject(ActivatedRoute);
//  _router = inject(Router)

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
    })

  }

  logout(){
    this._authService.logout();
  }

  profile(){
    //this._router.navigate(['/user/profile']);
  }
  get _loggedUser(){
    return loggedUser;
  }
  get isLogged(){
    return isLogged;
  }
}
