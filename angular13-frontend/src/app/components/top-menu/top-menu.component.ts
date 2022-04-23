import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  user: any;
  
  authorized: boolean = false;
  
  public isMenuCollapsed = true;

  constructor(public authService: AuthService ) { }

  ngOnInit(): void {
    this.user = this.authService.user
  }

}
