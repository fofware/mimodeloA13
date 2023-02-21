import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticuloListCardComponent } from '../articulo-list-card/articulo-list-card.component';
import { ApiService } from 'src/app/services/api.service';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-articulo-list',
  standalone: true,
  imports: [CommonModule,ArticuloListCardComponent],
  templateUrl: './articulo-list.component.html',
  styleUrls: ['./articulo-list.component.css']
})
export class ArticuloListComponent implements OnInit{
  data: any = [];
  searchItem='';
  limit = 30;
  count = 0;
  offset = 0;
  nextOffset: number | boolean = 0;
  loading = false;
  public screenWidth: any;
  public screenHeight: any;

  constructor(
    private api: ApiService
  ){}
  @ViewChild('searchInput', { static: true }) articulosSearchInput!: ElementRef;
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
    this.searchData();
  }

  ngAfterViewInit() {
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
      this.searchItem = text;
      this.searchData();
    })
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
    this.api.post('/articulos/public',params, {spinner: 'true'}).subscribe((data:any) => {
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

}
