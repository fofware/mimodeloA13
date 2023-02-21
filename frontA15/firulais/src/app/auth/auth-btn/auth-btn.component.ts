import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-auth-btn',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule
  ],
  templateUrl: './auth-btn.component.html',
  styleUrls: ['./auth-btn.component.css']
})
export class AuthBtnComponent implements OnInit, OnDestroy {
  user = {
    email: '',
    password: ''
  }

  _authService = inject(AuthService);
  _activatedRoute = inject(ActivatedRoute);
  _router = inject(Router)
  isLogged = false;

  @Output() newLoginEvent = new EventEmitter<boolean>()

  private destroy$ = new Subject<any>();

  ngOnInit(){
    this._authService.isLogged
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
    this._authService.signIn(this.user).subscribe(res => {
      const token:any = res;
      const user = this._authService.userValue;
      console.log(user);
      myDrop.close();
      this._router.navigate([`/${user.group}`],)
    })
  }

  logout(){
    this._authService.logout();
    this.newLoginEvent.emit(false)
  }

  profile(){
    this._router.navigate(['/user/profile']);
  }
}
