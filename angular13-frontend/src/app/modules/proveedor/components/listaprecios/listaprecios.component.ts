import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-listaprecios',
  templateUrl: './listaprecios.component.html',
  styleUrls: ['./listaprecios.component.css']
})

export class ListapreciosComponent implements OnInit {

  data:any[] = [];
  loading = false;
  offset: number | boolean = 0;
  nextOffset: number | boolean = 0;
  count = 0;
  limit = 50;
  searchItem = '';
  productos:any[] = [];
  proveedorId: string = '';

  constructor(
    private apiSrv: ApiService,
    private router: Router
  ) { }

  @ViewChild('searchInput', { static: true }) articulosSearchInput!: ElementRef;

  @HostListener('scroll', ['$event'])
  onScroll( elem:any ) {
      //console.log('scrollTop',elem.target.scrollTop)
      //console.log('offsetHeight',elem.offsetHeight)
      //console.log('scrollHeight',elem.scrollHeight)
      //console.log('scrollHeight',elem.scrollHeight)

      //console.log('-----------------------------')
      if(( elem.target.offsetHeight + elem.target.scrollTop ) >=  elem.target.scrollHeight-800) {
        //console.log(elem.offsetHeight)
        //console.log(elem.scrollTop)
        //console.log(elem.scrollHeight)
        //console.log('entro',elem.offsetHeight + elem.scrollTop, elem.scrollHeight)
        if( this.nextOffset !== false ) this.setData();
      }
    }


  ngOnInit(): void {
    this.router.routerState.snapshot.url
    .split('/').map((value, idx, array)=> {
      if(value === 'proveedores') {
        this.proveedorId = array[idx+1]
      }
    });

    this.apiSrv.get(`/proveedor/${this.proveedorId}/productos`,{
      limit: 500
    })
    .subscribe((retData:any) => {
      console.log(retData);
      this.productos = retData.rows;
      this.provDataSort();
      console.log(this.productos);
    });

    fromEvent(this.articulosSearchInput.nativeElement, 'keyup')
    .pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 3 || res.length === 0)
      // Time in milliseconds between key events
      , debounceTime(700)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    )
    .subscribe((text: string) => {
      this.searchData();
    })
    //this.searchData();
  }

  provDataSort(){
    if(this.productos)
    this.productos.sort((a, b) => {
      let fa = a.fullname.toLowerCase(),
          fb = b.fullname.toLowerCase();
      if (fa < fb) {
          return -1;
      }
      if (fa > fb) {
          return 1;
      }
      return 0;
    });
  }

  setData() {
    if(this.loading) return;
    if(this.nextOffset === false) return;
    this.loading = true;
    const params = {
      limit: this.limit,
      offset: this.nextOffset,
      sort: 'fullname',
      searchItem: this.searchItem
    };
    this.apiSrv.post('/articulos/public',params).subscribe((data:any) => {
      console.log(data);
      this.count = data.count;
      this.offset = data.offset;
      this.nextOffset = data.nextOffset;
      this.data = this.data.concat(data.rows);
      console.log(this.data.length);
      console.log(data.apiTime);
      this.loading = false;
    });
  }

  searchData(){
    this.nextOffset = 0;
    this.count = 0;
    this.data = [];
    this.setData();
  }

  async edit(ev:any){
  }

}
