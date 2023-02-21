import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ListCardComponent } from './list-card/list-card.component';
import { Router, RouterModule } from '@angular/router';
import { ArticuloService } from '../articulo-edit.service';

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
export class ArticulosListComponent implements OnInit, OnDestroy{
  _api = inject(ApiService);
  _router = inject(Router);
  _location = inject(Location);
  _artSrv = inject(ArticuloService);
  listData:any[] = [];
  private destroy$ = new Subject<any>();

  searcher = new FormControl('');

  emptyData = true;
  scrollTop = 0;
  nextOffset:number | boolean = 0;
  limit = 12;
  searchItem = '';
  count = 0;
  offset = 0;
  loading = false;

  @HostListener('scroll', ['$event'])
  onScroll( elem:any ) {
    this.scrollTop = Math.ceil(elem.target.scrollTop);
    /*
    console.log(this.scrollTop,elem.target.scrollHeight,elem.target.offsetHeight);
    console.log( this.scrollTop + elem.target.offsetHeight + 100, elem.target.scrollHeight)
    */
    if((this.scrollTop + elem.target.offsetHeight + 400 ) > ( elem.target.scrollHeight ) ) {
      if( this.nextOffset !== false ) this.readData();
    }
  }

  ngOnInit(): void {
    this.readData();
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
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  readNewData(): void {
    this.count = 0;
    this.offset = 0;
    this.nextOffset = 0;
    this.scrollTop = 0;
    this.listData = [];
    this.readData();
  }

  readData(): void {
    if(this.loading) return;

    this.loading = true;

    const pagination = {
      limit: this.limit,
      offset: this.nextOffset,
      searchItem: this.searchItem
    }

    this._api.get(`/articulos/maestro`, pagination)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res =>
      {
      console.log(res)
      if(res.count) this.emptyData = false;
      this.count = res.count;
      this.offset = res.offset;
      this.nextOffset = res.nextOffset;
      this.listData = this.listData.concat(res.rows);
      console.log(this.listData);
      //this._artSrv.listData$.next(this.listData);
      //console.log(this._artSrv.listData$.value);
      this.loading = false;

      setTimeout(() => {
        const elem = document.getElementsByClassName('main')[0];
        if(elem.scrollHeight === elem.clientHeight && this.nextOffset ){
          if(this.count > 0 && this.nextOffset) this.readData();
        }
      }, 50);
    })
  }

  edit(idx:any){
    console.log('Editar',idx);
    this._artSrv.idx$.next(idx);
    this._artSrv.setRegData(this.listData[idx]);
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
      listData: this.listData,
      count: this.count,
      offset: this.offset,
      searchItem: this.searchItem,
      nextOffset: this.nextOffset,
    })
  }

}
