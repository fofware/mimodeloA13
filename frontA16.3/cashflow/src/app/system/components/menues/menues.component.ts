import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService, menuPage } from 'src/app/services/menu.service';
import { PMenuComponent } from 'src/app/components/p-menu/p-menu.component';

@Component({
  selector: 'app-menues',
  standalone: true,
  imports: [
    CommonModule,
    PMenuComponent
  ],
  templateUrl: './menues.component.html',
  styleUrls: ['./menues.component.scss']
})
export class MenuesComponent {
  _menu = inject(MenuService);

  ngOnInit(): void {
    //this.setMenu()
  }

  async setMenu(){
    menuPage.set(await this._menu.getMenuP('usersHome') );
    console.log(menuPage());
  }

}
