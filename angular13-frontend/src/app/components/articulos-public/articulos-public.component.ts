import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-articulos-public',
  templateUrl: './articulos-public.component.html',
  styleUrls: ['./articulos-public.component.css']
})

export class ArticulosPublicComponent implements OnInit {
  data:any[] = [];
  searchItem:any = '';
  limit = 40;
  count = 0;
  offset = 0;
  nextOffset: number | boolean = 0;
  loading = false;

  constructor(
    private api: ApiService
  ) { }

  @ViewChild('searchInput', { static: true }) articulosSearchInput!: ElementRef;

  @HostListener('scroll', ['$event.target'])
  onScroll( elem:any ) {
    if(( elem.offsetHeight + elem.scrollTop ) >=  elem.scrollHeight-200) {
      if( this.nextOffset !== false ) this.setData();
    }
  }

  ngOnInit(): void {
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
    this.searchData();
  }

  setData(){
    if(this.loading) return;
    if(this.nextOffset === false) return;
    this.loading = true;
    const params = {
      pVenta: true,
      limit: this.limit,
      offset: this.nextOffset,
      searchItem: this.searchItem,
      //sort: {'marca':1, 'especie': 1, 'edad': 1, 'name': 1, 'raza': 1 }
    };
    console.log(params);
    this.api.post('/articulos/public',params).subscribe((data:any) => {
      console.log(data);
      this.count = data.count;
      this.offset = data.offset;
      this.nextOffset = data.nextOffset;
      //for (let i = 0; i < data.data.length; i++) {
      //  const element = data.data[i];
      //  this.makeFullName(data.data[i]);
      //}
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

  makeFullName(reg:any){
    reg['fullname']  = '';
    let sep = '';
    if(reg.d_fabricante){
      reg['fullname'] = reg.fabricante.name;
      sep = ' ';
    }
    if(reg.d_marca){
      reg['fullname'] += sep+reg.marca.name;
      sep = ' ';
    }
    if (reg.name){
      reg['fullname'] += sep+reg.name;
      sep = ' ';
    }
    if(reg.d_especie){
      reg['fullname'] += sep+reg.especie.name;
      sep = ' ';
    }
    if(reg.d_edad){
      reg['fullname'] += sep+reg.edad.name;
      sep = ' ';
    }
    if(reg.d_raza){
      reg['fullname'] += sep+reg.raza.name;
      sep = ' ';
    }
    if(reg.d_rubro){
      reg['fullname'] += sep+reg.rubro.name;
      sep = ' ';
    }
    if(reg.d_linea){
      reg['fullname'] += sep+reg.linea.name;
      sep = ' ';
    }
    return reg['fullname'];
  }
}
