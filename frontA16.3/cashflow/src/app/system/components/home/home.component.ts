import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { PMenuComponent } from 'src/app/components/p-menu/p-menu.component';
//import { MenuService, menuPage } from 'src/app/services/menu.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
  //  PMenuComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
/*
  _menu = inject(MenuService);
  ngOnInit(): void {
    this.setMenu()
  }

  async setMenu(){
    menuPage.set(await this._menu.getMenuP('system') );
    console.log(menuPage());
  }
*/
}
