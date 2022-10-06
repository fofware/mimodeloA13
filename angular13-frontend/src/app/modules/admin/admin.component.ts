import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  breadcrumb:any = [];
  constructor(
    private actRoute: ActivatedRoute,
    private route: Router,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
//    console.log('route',this.route);
    this.makeBreadcrumb(this.route.url)
    this.route.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe( (event: any) => {
      console.log("NavigationEnd",event)
      this.makeBreadcrumb(event.url)
      });

//    console.log(array);
    console.log("actRoute",this.actRoute);
    
    console.log("snapshot",this.actRoute.snapshot);
    console.log("data",this.actRoute.snapshot.data);
    console.log("queryParams", this.actRoute.snapshot.queryParams);
    
  }

  makeBreadcrumb(url:string) {
    this.breadcrumb = [];
    const array:any = url.split('/').slice(1,-1);
    let parent = ''
    let links = ['']
    array.map( (e:any) => {
      const data = this.menuService.get(e);
//      const link = parent === '' ? e : `${parent}/${e}`
      links.push(e);
      const link = JSON.parse(JSON.stringify(links));
      this.breadcrumb.push( {link,title:data.title} );
      //parent = e;
    })

  }
}
