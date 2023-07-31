import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService, iMenuData, iMenuLink, menuPage } from 'src/app/services/menu.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-p-menu',
  standalone: true,
  imports: [
    CommonModule,
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

  get Menu(){
    //console.log("asdfadfadf",userVMenu());
    return menuPage();
  }

  texto(it:iMenuLink) {
    const icon = it.icon === undefined ? '' : it.icon;
    const clase = icon.match(/.*class="([a-z -]+)".*/);
    if(clase){
      //console.log(clase[1]);
      return (`fa-2xl ${clase[1]}`).trim();
    }
//    it.link = ['../', ...it.link];
    //const title = it.title === undefined ? '' : it.title;
    return ''
  }
  link(it:iMenuLink){
    return ['..', ...it.link]
  }
}
