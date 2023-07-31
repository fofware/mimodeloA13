import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PMenuComponent } from '../components/p-menu/p-menu.component';
import { MenuService, menuPage } from '../services/menu.service';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [
    //CommonModule,
    RouterOutlet,
    PMenuComponent
  ],
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent {

  _menu = inject(MenuService);
  ngOnInit(): void {
    this.setMenu()
  }

  async setMenu(){
    menuPage.set(await this._menu.getMenuP('system') );
    console.log(menuPage());
  }

}
