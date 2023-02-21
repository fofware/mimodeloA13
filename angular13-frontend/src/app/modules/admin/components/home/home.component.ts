import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  menuId = '';

  data: any = {};
  title = '';
  comment = '';
  menu: any[] = [];
  breadcrumb:any = [];

  constructor(
    public actRoute: ActivatedRoute,
    public route: Router,
    private menuService: MenuService
  ) {
    this.menuId = this.actRoute.snapshot.params['id'] || 'admin';

    this.findMenu();

  }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe(params => {
      console.log( 'params', params);
      //this.menuId = 'menu';//params['id'];
      //this.findMenu();
    });
  }

  findMenu(): void{
    const menuData = this.menuService.get( this.menuId) ;
    this.data = menuData;
    console.log("Menu Data",this.data);
  }

}
