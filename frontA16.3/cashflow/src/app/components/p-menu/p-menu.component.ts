import { Component, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MenuService, iMenuData, iMenuLink, menuPage } from 'src/app/services/menu.service';
import { RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-p-menu',
  standalone: true,
  imports: [
    //CommonModule,
    NgIf,
    NgFor,
    RouterLink,
  ],
  templateUrl: './p-menu.component.html',
  styleUrls: ['./p-menu.component.scss']
})
export class PMenuComponent {
  /*
  _activatedRoute = inject(ActivatedRoute);
  _user = inject(UsersService);
  */
  _menu = inject(MenuService);

  sanitized = inject(DomSanitizer);
  get Menu(){
    //console.log("asdfadfadf",userVMenu());
    return menuPage();
  }

  icon(it:iMenuLink){
    const icon = it.icon === undefined ? '' : it.icon;
    return this.sanitized.bypassSecurityTrustHtml(icon);
  }

  link(it:iMenuLink){
    return [['..'], ...it.link]
  }
}
