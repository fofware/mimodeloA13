import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map } from 'rxjs';
import { FabricanteFd, FabricanteResponse } from 'src/app/models/fabricante';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-fabricante',
  templateUrl: './fabricante.component.html',
  styleUrls: ['./fabricante.component.css']
})
export class FabricanteComponent implements OnInit {
  data:FabricanteFd[] = [];
  loading = false;
  offset: number | boolean = 0;
  nextOffset: number | boolean = 0;
  count = 0;
  limit = 50;
  searchItem = '';
  nuevo: FabricanteFd = {name:'',images:['']};
  nombre = "";
  image = "";
  constructor(
    private apiSrv: ApiService
  ) { }

  @ViewChild('searchInput', { static: true }) SearchInput!: ElementRef;
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
    fromEvent(this.SearchInput.nativeElement, 'keyup')
    .pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2 || res.length === 0)
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
      limit: this.limit,
      offset: this.nextOffset,
      sort: 'name',
      searchItem: this.searchItem
    };
    this.apiSrv.get('/fabricantes',params).subscribe((data:FabricanteResponse) => {
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

}
