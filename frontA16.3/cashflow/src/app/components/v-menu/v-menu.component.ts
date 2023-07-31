import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { UsersService } from 'src/app/users/services/users.service';
import { NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';
import { userVMenu } from 'src/app/users/services/users.service';
import { iTopMenu } from '../top-menu/top-menu.component';

@Component({
  selector: 'app-v-menu',
  standalone: true,
  imports: [
    CommonModule,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    RouterLink,
    RouterModule
  ],
  templateUrl: './v-menu.component.html',
  styleUrls: ['./v-menu.component.scss']
})
export class VMenuComponent {
  _activatedRoute = inject(ActivatedRoute);
  _menu = inject(UsersService);

  get userMenu(){
    //console.log("asdfadfadf",userVMenu());
    return userVMenu();
  }

  texto(it:iTopMenu) {
    const icon = it.icon === undefined ? '' : it.icon;
    const title = it.title === undefined ? '' : it.title;
    return (`${icon} ${title}`).trim();
  }

}
