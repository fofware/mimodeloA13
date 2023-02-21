import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  menuId = 'admin';

  data: any = {};
  title = '';
  comment = '';
  menu: any[] = [];
  breadcrumb:any = [];

  constructor(
    readonly menuSrv: MenuService
  ){}

  ngOnInit(): void {
    this.findMenu();
  }

  findMenu(): void{
    const menuData = this.menuSrv.get( this.menuId) ;
    this.data = menuData;
    console.log("Menu Data",this.data);
  }

}
