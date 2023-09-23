import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { UsersService } from 'src/app/users/services/users.service';
import { NgbNav, NgbNavChangeEvent, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';
import { userVMenu } from 'src/app/users/services/users.service';
import { iTopMenu } from '../top-menu/top-menu.component';
import { DomSanitizer } from '@angular/platform-browser';

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
export class VMenuComponent implements OnInit {
  _activatedRoute = inject(ActivatedRoute);
  _menu = inject(UsersService);
  sanitized = inject(DomSanitizer);
  active = 1;

  ngOnInit(): void {
    //this._activatedRoute.fragment.subscribe( (ret:any) => this.option = ret.url)
  }
	onNavChange(changeEvent: NgbNavChangeEvent) {
    console.log(changeEvent);
		/*
    if (changeEvent.nextId === 3) {
			changeEvent.preventDefault();
		}
    */
	}

  get userMenu(){
    //console.log("asdfadfadf",userVMenu());
    return userVMenu();
  }

  icon(it:iTopMenu){
    const icon = it.icon === undefined ? '' : it.icon;
    return this.sanitized.bypassSecurityTrustHtml(icon);
  }

  texto(it:iTopMenu) {
    const icon = it.icon === undefined ? '' : this.icon(it);
    const title = it.title === undefined ? '' : it.title;
    return (`${icon} ${title}`).trim();
  }

}
