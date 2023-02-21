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
  limit = 30;
  count = 0;
  offset = 0;
  nextOffset: number | boolean = 0;
  loading = false;
  public screenWidth: any;
  public screenHeight: any;

  constructor(
    private api: ApiService
  ) { }

  @ViewChild('searchInput', { static: true }) articulosSearchInput!: ElementRef;
  //@ViewChild('myTabla', { static: true }) myTableRef!: ElementRef;
  @HostListener('scroll', ['$event.target'])
  onScroll( elem:any ) {
    //console.log('scrollTop',elem.scrollTop)
    //console.log('offsetHeight',elem.offsetHeight)
    //console.log('scrollHeight',elem.scrollHeight)
    //console.log('scrollHeight',elem.scrollHeight)

    //console.log('-----------------------------')
    if(( elem.offsetHeight + elem.scrollTop ) >=  elem.scrollHeight-800) {
      //console.log(elem.offsetHeight)
      //console.log(elem.scrollTop)
      //console.log(elem.scrollHeight)
      //console.log('entro',elem.offsetHeight + elem.scrollTop, elem.scrollHeight)
      if( this.nextOffset !== false ) this.setData();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?:any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    const navs = document.getElementsByTagName('nav');
    let h = navs[0].offsetHeight+1;
    const el:any = document.getElementById('articuloContainer')?.parentElement;
    el.style.height = `${this.screenHeight-h}px`;
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

  ngAfterViewInit() {
    this.onResize();
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
    this.api.post('/articulos/public',params, {spinner: 'false'}).subscribe((data:any) => {
      console.log(data);
      this.loading = false;
      this.count = data.count;
      this.offset = data.offset;
      this.nextOffset = data.nextOffset;
      //data.rows.map((reg:any) => { this.makeFullName(reg); })
      this.data = this.data.concat(data.rows);
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
      reg['fullname'] = reg.fabricante;
      sep = ' ';
    }
    if(reg.d_marca){
      reg['fullname'] += sep+reg.marca;
      sep = ' ';
    }
    if (reg.name){
      reg['fullname'] += sep+reg.name;
      sep = ' ';
    }
    if(reg.d_especie){
      reg['fullname'] += sep+reg.especie;
      sep = ' ';
    }
    if(reg.d_edad){
      reg['fullname'] += sep+reg.edad;
      sep = ' ';
    }
    if(reg.d_raza){
      reg['fullname'] += sep+reg.raza;
      sep = ' ';
    }
    if(reg.d_rubro){
      reg['fullname'] += sep+reg.rubro;
      sep = ' ';
    }
    if(reg.d_linea){
      reg['fullname'] += sep+reg.linea;
      sep = ' ';
    }
    return reg['fullname'];
  }
}
