import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin-btn',
  templateUrl: './signin-btn.component.html',
  styleUrls: ['./signin-btn.component.css']
})

export class SigninBtnComponent implements OnInit, OnDestroy {
  user:any = {};
  isLogged = false;

  @Output() newLoginEvent = new EventEmitter<boolean>()

  private destroy$ = new Subject<any>();

  constructor(public authSrv: AuthService, private router: Router ) { }

  ngOnInit(): void {
    this.authSrv.isLogged
      .pipe( takeUntil(this.destroy$) )
      .subscribe( res => {
        this.isLogged = res;
        //this.user = this.authService.userValue;
        this.newLoginEvent.emit(res);
      });


  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  login(myDrop:any):void {
    console.log(this.user)
    this.authSrv.signIn(this.user).subscribe(res => {
      const token:any = res;
      const user = this.authSrv.userValue;
      console.log(user);
      myDrop.close();
      this.router.navigate([`/${user.group}`])
    })
  }

  logout(){
    this.authSrv.logout();
    this.newLoginEvent.emit(false)
  }

  profile(){
    this.router.navigate(['/user/profile']);
  }

}
