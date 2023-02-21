import { Component, OnInit, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
/*
  https://valor-software.com/ngx-bootstrap/#/components/modals?tab=overview#service-with-interceptor
*/
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public isMenuCollapsed = true;

  proveedores:any;
  data:any[] = [];
  loading = false;
  offset: number | boolean = 0;
  nextOffset: number | boolean = 0;
  count = 0;
  limit = 50;
  searchItem = '';

  constructor(
    private router : Router,
    private apiSrv: ApiService
  ) { }

  ngOnInit(): void {
    this.setData()
  }

  setData(){
    if(this.loading) return;
    if(this.nextOffset === false) return;
    this.loading = true;
    const params = {
      limit: this.limit,
      offset: this.nextOffset,
      searchItem: this.searchItem
    };
    this.apiSrv.get('/proveedores',params).subscribe((data:any) => {
      console.log(data);
      this.count = data.count;
      this.offset = data.offset;
      this.nextOffset = data.nextOffset;
      this.data = this.data.concat(data.rows);
      console.log(this.data.length);
      console.log(data.apiTime);
      this.loading = false;
      if(this.count === 0){
        this.router.navigate(['proveedores','new'])
      }
    });
  }

  gotoDynamic(item:any) {
    //console.log(item);
    this.router.navigate(['admin','compras','proveedores', item._id] );
  }

}
