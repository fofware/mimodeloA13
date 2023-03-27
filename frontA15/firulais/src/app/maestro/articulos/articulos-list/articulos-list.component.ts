import { AfterViewInit, Component, HostListener, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ListCardComponent } from './list-card/list-card.component';
import { Router, RouterModule } from '@angular/router';
import { ArticuloService } from '../articulo-edit.service';
import { apiResponse } from 'src/app/models/apiResponse';
import { maestroArticuloFd, maestroArticuloResponse } from '../../models/maestro.model.articulo';

@Component({
  selector: 'app-articulos-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ListCardComponent
  ],
  templateUrl: './articulos-list.component.html',
  styleUrls: ['./articulos-list.component.css']
})
export class ArticulosListComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges{
  _api = inject(ApiService);
  _router = inject(Router);
  _location = inject(Location);
  _artSrv = inject(ArticuloService);

  listData:maestroArticuloResponse = {
    apiTime: 0,
    count: 0,
    filter: {},
    limit: 12,
    message: '',
    nextOffset: 0,
    offset: 0,
    rows: [],
    sort: {},
    url: ''
  }
  //container!: HTMLElement;

  private destroy$ = new Subject<any>();
  data$ = this._artSrv.listData$;
  scroll$ = this._artSrv.scroll$;
  scrollHeight$ = this._artSrv.scrollHeight$;
  searcher = new FormControl('');

  emptyData = true;
  scrollTop = 0;
  scrollReady = false;
  //nextOffset:number | boolean = 0;
  //limit = 12;
  searchItem = '';
  //count = 0;
  //offset = 0;
  loading = false;

  @HostListener('scroll', ['$event'])
  onScroll( elem:any ) {
    //console.log('-----------------');
    const st = Math.ceil(elem.target.scrollTop);


//    this.scrollTop = Math.ceil(elem.target.scrollTop);
//    if(!this.scrollReady){
//      console.log('scrollTop',st, this.scroll$.value);
//      console.log('clientHeight',elem.target.clientHeight);
//      console.log('scrollHeight',elem.target.scrollHeight, this.scrollHeight$.value, this.scrollReady);
//      console.log('-----------------');
//
//      }
    if (!this.scrollReady && elem.target.scrollHeight < this.scrollHeight$.value) return;
    if(!this.scrollReady){
      elem.target.scrollTop = this.scroll$.value;
      this.scrollReady = true;
      return
    } else {
      this.scroll$.next(st);
      this.scrollHeight$.next(elem.target.scrollHeight);
    }


//    console.log('scrollTop',st, this.scroll$.value);
//    console.log('clientHeight',elem.target.clientHeight);
//    console.log('scrollHeight',elem.target.scrollHeight, this.scrollHeight$.value, this.scrollReady);
//    console.log('scroll$', this.scroll$.value);
//    console.log('offsetHeight',elem.target.offsetHeight);
//    console.log('-----------------');

    this.scroll$.next(st);
    this.scrollHeight$.next(elem.target.scrollHeight);

    /*
    console.log(this.scrollTop,elem.target.scrollHeight,elem.target.offsetHeight);
    console.log( this.scrollTop + elem.target.offsetHeight + 100, elem.target.scrollHeight)
    */
    if((st + elem.target.offsetHeight + 400 ) > ( elem.target.scrollHeight ) ) {
      if( this.listData.nextOffset !== false ) this.readData();
    }
  }

  ngOnInit(): void {
    if(this.data$.value.rows.length){
      this.listData = <maestroArticuloResponse>this.data$.value;
      this.emptyData = false;
      //console.log('hay datos', this.scroll$.value,this.scrollHeight$.value);
    } else {
      //console.log('NO HAY DATOS');
      this.scrollReady = true;
      this.readData();
    }
    /*
    this.data$.subscribe((res) => {
        console.log('data$', res)
        this.listData = <ListData>res
    });
    */
    //console.log(this.listData);
    this.searcher.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(700)
      )
      .subscribe( searchItem => {
        if(searchItem?.length){
          this.searchItem = searchItem;
          this.readNewData();
        } else {
          this.searchItem = '';
          this.readNewData();
       }
      });


/*
    this.scroll$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(top => {
      console.log('_scroll$',top);
    });
    this.scrollHeight$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(top => {
      console.log('_scrollHeight$',top);
    });
  */
  }

  ngAfterViewInit(): void {
    //console.log('afterViewInit');
    const elem = document.getElementById('scrollData');
    //console.log('afterViewInit element', elem);
    //console.log('afterViewInit scroll', this.scroll$.value);
    if(elem) elem.scrollTop = this.scroll$.value;
    /*
    this.scrollTop = this.scroll$.value;
    if(this.container)
      this.container.scrollTop = this.scroll$.value;
    */
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnDestroy(): void {
    /*
    console.log(this.data$.value);
    console.log(this._artSrv.extraData$.value);
    console.log(this._artSrv.listData$.value);
    console.log(this._artSrv.extraData$.value);
    console.log(this._artSrv.presentacionesData$.value);
    console.log(this._artSrv.regData$.value);
    console.log(this._artSrv.scroll$.value);
    console.log(this._artSrv.scrollHeight$.value);
    */
    this.destroy$.next({});
    this.destroy$.complete();
  }

  readNewData(): void {
    this.scrollTop = 0;
    this.listData = {
      apiTime: 0,
      count: 0,
      filter: {},
      limit: 12,
      message: '',
      nextOffset: 0,
      offset: 0,
      rows: [],
      sort: {},
      url: ''
    };
    this.readData();
  }

  readData(): void {
    if(this.loading) return;

    this.loading = true;
    const pagination = {
      limit: this.listData.limit,
      offset: this.listData.nextOffset,
      searchItem: this.searchItem
    }

    this._api.get(`/articulos/maestro`, pagination)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res:maestroArticuloResponse) =>
      {
        //console.log(res);
        const rows = this.listData.rows.concat(res.rows);
        this.listData = res;
        this.listData.rows = <[]>rows;
        this.emptyData = false;
        this._artSrv.listData$.next(this.listData);
        console.log('readData', this.listData);

        //console.log(this._artSrv.listData$.value);
        this.loading = false;

        setTimeout(() => {
          const elem = document.getElementById('scrollData');
          console.log('elem?.clientHeight',elem?.clientHeight)
          if(elem?.scrollHeight === elem?.clientHeight && this.listData.nextOffset ){
            if(this.listData.count > 0 && this.listData.nextOffset) this.readData();
          }
        }, 50);
      })
  }

  edit(idx:any){
    //this._artSrv.idx$.next(idx);
    //this._artSrv.selectedArticulo$.next(this.listData.rows[idx])
    this._artSrv.initArticulo(idx);
    const params = this.setState();
    this._router.navigate(['maestro/articulos/edit'], { state: {idx, ...params}});
  }
  borrar(e:any){
    console.log('Borrar',e)
  }
  nuevo(){

  }
  setState(){
    return ({
      from: this._location.path(true),
      scrollTop: this.scrollTop,
      //listData: this.listData,
      searchItem: this.searchItem,
    })
  }

}
