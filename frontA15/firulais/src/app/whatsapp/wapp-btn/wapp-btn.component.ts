import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-wapp-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wapp-btn.component.html',
  styleUrls: ['./wapp-btn.component.css']
})
export class WappBtnComponent implements OnInit, OnDestroy {
  _authService = inject(AuthService);
  isLogged = false;
  private destroy$ = new Subject<any>();

  ngOnInit(): void{
    this._authService.isLogged
      .pipe( takeUntil(this.destroy$) )
      .subscribe( res => {
        this.isLogged = res;
        //this.user = this.authService.userValue;
        //this.newLoginEvent.emit(res);
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
