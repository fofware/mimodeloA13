import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-private-home',
  templateUrl: './private-home.component.html',
  styleUrls: ['./private-home.component.css']
})
export class PrivateHomeComponent implements OnInit {

  menuId = '';
  data: any = {};
  title = '';
  comment = '';
  menu: any[] = [];

  constructor(
    public actRoute: ActivatedRoute,
    private menuService: MenuService
  ) {
      console.log(this.actRoute.snapshot);
      console.log("data",this.actRoute.snapshot.data);
      console.log("queryParams", this.actRoute.snapshot.queryParams);

      this.menuId = this.actRoute.snapshot.params['id'] || 'menu';
      this.findMenu();
      //console.log('this.menuId', this.menuId);
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
    console.log(this.data);
  }
}
