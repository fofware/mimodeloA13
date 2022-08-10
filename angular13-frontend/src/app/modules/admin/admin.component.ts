import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  breadcrumb = [];
  constructor(
    public actRoute: ActivatedRoute,
    public route: Router 
  ) { }

  ngOnInit(): void {
    console.log('route',this.route);

    const array:any = this.route.url.split('/');
    this.breadcrumb = array;
    console.log(array);
    console.log("actRoute",this.actRoute);
    /*
    console.log("snapshot",this.actRoute.snapshot);
    console.log("data",this.actRoute.snapshot.data);
    console.log("queryParams", this.actRoute.snapshot.queryParams);
    */
  }

}
