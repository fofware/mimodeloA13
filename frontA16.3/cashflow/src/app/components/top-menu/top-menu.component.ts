import { Component, inject, signal, HostListener, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapse, NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { UserBtnComponent } from '../../users/components/user-btn/user-btn.component';
import { AlertBtnComponent } from '../alert-btn/alert-btn.component';
import { WappBtnComponent } from '../wapp-btn/wapp-btn.component';
import { UsersService, userTopMenu } from 'src/app/users/services/users.service';
import { MenuService } from 'src/app/services/menu.service';

export interface iTopMenu {
  title: string,
  icon?:string,
  link: string | string[],
  fragment?: string,
  //roles?: string[],
  hidden?: boolean,
  state?:any
}

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [
    CommonModule,
    NgbCollapse,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    RouterLink,
    RouterModule,
    UserBtnComponent,
    AlertBtnComponent,
    WappBtnComponent
  ],
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  public isMenuCollapsed = true;
  public screenWidth = window.innerWidth;
  public screenHeight = window.innerHeight;

  @HostListener('window:resize', ['$event'])
  onResize(event?:any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  _activatedRoute = inject(ActivatedRoute);
  _user = inject(UsersService);
  //_menu = inject(MenuService);

  ngOnInit(): void {
    this.onResize();
    //this._user.decodeToken(this._user.getToken());
    //this._user.getvMenu('topMenu').subscribe((res:any) => userTopMenu.set(res));
  }

  get userTopMenu(){
    return userTopMenu();
  }
  texto(it:iTopMenu) {
    const icon = it.icon === undefined ? '' : it.icon;
    const title = it.title === undefined ? '' : it.title;
    return (`${icon} ${title}`).trim();
  }
}
