import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppMenuService } from '../services/app-menu.service';

@Component({
  selector: 'app-app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css']
})
export class AppMenuComponent {
  _actRoute = inject(ActivatedRoute);
  _menuService = inject(AppMenuService)

  menuId = '';
  data: any = {};
  title = '';
  comment = '';
  menu: any[] = [];

  constructor(
  ) {
    /*
      console.log(this._actRoute.snapshot);
      console.log("data",this._actRoute.snapshot.data);
      console.log("queryParams", this._actRoute.snapshot.queryParams);
    */
      this.menuId = this._actRoute.snapshot.data['id'] || 'admin';
      this.findMenu();
    }

  ngOnInit(): void {
    this._actRoute.queryParams.subscribe(params => {
      console.log( 'params', params);
      //this.menuId = 'menu';//params['id'];
      //this.findMenu();
    });
  }

  findMenu(): void{
    const menuData = this._menuService.get( this.menuId) ;
    this.data = menuData;
    console.log(this.data);
  }

}
