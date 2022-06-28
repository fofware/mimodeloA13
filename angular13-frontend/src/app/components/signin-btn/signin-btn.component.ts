import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
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

  constructor(public authService: AuthService ) { }

  ngOnInit(): void {
    this.authService.isLogged.pipe(
      takeUntil(this.destroy$)
    ).subscribe( res => {
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
    this.authService.signIn(this.user).subscribe(res => {
      const token:any = res;
      myDrop.close();
    })
  }

  logout(){
    this.authService.logout();
    this.newLoginEvent.emit(false)
  }
}
