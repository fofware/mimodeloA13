import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-htmldata',
  templateUrl: './htmldata.component.html',
  styleUrls: ['./htmldata.component.css']
})


export class HtmldataComponent implements OnInit {
  data:any[] = [];
  searchItem:any = '';
  limit = 50;
  count = 0;
  offset = 0;
  loading = false;
  constructor(
    private api: ApiService
  ) { }

  @ViewChild('searchInput', { static: true }) articulosSearchInput!: ElementRef;

  @HostListener('scroll', ['$event.target'])
  onScroll(elem:any){
   if(( elem.offsetHeight + elem.scrollTop) >=  elem.scrollHeight-200) {
      if(this.count === 0 || this.offset < this.count )
        this.setData();
    }
  }

  ngOnInit(): void {
    fromEvent(this.articulosSearchInput.nativeElement, 'keyup').pipe(
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
    ).subscribe((text: string) => {
      this.searchData();
    })
    const params = {
      limit: 850,
      offset: this.offset,
      searchItem: this.searchItem
    };
    console.log(params);
    //this.api.get('/productos/textsearch',params).subscribe((data:any) => {
    this.api.get('/productos/fulldata',params).subscribe((data:any) => {
        console.log(data);
      this.count = data.count;
      this.offset = data.nextOffset;

      this.data = this.data.concat(data.data);
      console.log(this.data.length);
      this.loading = false;
    });

    //this.setData();
  }

  setData(){
    if(this.loading) return;
    this.loading = true;
    const params = {
      limit: this.limit,
      offset: this.offset,
      searchItem: this.searchItem
    };
    console.log(params);
    this.api.get('/productos/textsearch',params).subscribe((data:any) => {
    //this.api.get('/productos/fulldata',params).subscribe((data:any) => {
        console.log(data);
      this.count = data.count;
      this.offset = data.nextOffset;

      this.data = this.data.concat(data.data);
      console.log(this.data.length);
      this.loading = false;
    });
  }
  searchData(){
    this.offset = 0;
    this.count = 0;
    this.data = [];
    this.setData();
  }

  grabar(){
    for (let i = 0; i < this.data.length; i++) {
      const e = this.data[i];
      this.api.post('/productoname',e).subscribe((data:any) => {
        console.log(e);
        console.log(data);
      });
    }
  }
}
