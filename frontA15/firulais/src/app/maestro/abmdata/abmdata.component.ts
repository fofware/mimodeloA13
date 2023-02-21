import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { iAbmFd, iAbmResponse } from 'src/app/maestro/models/abm';
//import { AbmdataFormComponent } from './abmdata-form_to_delete/abmdata-form.component';
import { AbmdataCardComponent } from './abmdata-card/abmdata-card.component';

//https://medium.com/@roliver_javier/angular-changedetector-894fd7e4dd6e
//https://www.youtube.com/watch?v=UTT90NU_a0A
@Component({
  selector: 'app-abmdata',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    //AbmdataFormComponent,
    AbmdataCardComponent
  ],
  templateUrl: './abmdata.component.html',
  styleUrls: ['./abmdata.component.css']
})
export class AbmdataComponent implements OnInit, OnDestroy{
  arouter = inject(ActivatedRoute)
  api = inject(ApiService);
  _router = inject(Router);
  _location = inject(Location);
  emptyData=true;
  params!:any;
  searchItem = '';
  searcher = new FormControl('');
  selected='no'
  private destroy$ = new Subject<any>();
  data$!: Observable<iAbmResponse>
  listData:iAbmFd[] = [];

  loading= false;
  limit = 10;
  count = 0;
  offset = 0;
  nextOffset: boolean | number = 0;
  rtData!:any;
  scrollTop!:number;

  form = new FormGroup({
    name: new FormControl('',Validators.required),
    images: new FormArray([]),
    icons: new FormArray([])
  })

  @HostListener('scroll', ['$event'])
  onScroll( elem:any ) {
    this.scrollTop = Math.ceil(elem.target.scrollTop);
    if(elem.target.scrollTop > ( elem.target.scrollHeight - elem.target.offsetHeight - 100) ) {
      if( this.nextOffset !== false ) this.readData();
    }
  }

  ngOnInit(): void {
    this.params = this._location.getState();
    console.log(this.params);
    if(this.params.listData){
      this.rtData = this.params.rtData;
      this.listData = this.params.listData;
      this.count = this.params.count;
      this.offset = this.params.offset;
      this.nextOffset = this.params.nextOffset;
      this.searchItem = this.params.searchItem;
      this.searcher.setValue(this.searchItem);
    } else {
      this.rtData = this.arouter.snapshot.data;
      /*
      this.data$ = this.api.get(`/${this.rtData.getData}`,
        {
          limit: this.limit,
          offset: this.nextOffset,
          searchItem: this.searchItem
        }
      );
      */
      this.readData();
    }

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

  ngAfterViewInit(): void{
    if(this.params?.scrollTop){
      const elem = document.getElementsByClassName('main')[0];
      elem.scrollTop = this.params.scrollTop;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  readData(){
    if(this.loading) return;
    this.loading = true;
    const pagination = {
      limit: this.limit,
      offset: this.nextOffset,
      searchItem: this.searchItem
    }
    try {
      this.api.get(`/mabm/${this.rtData.coleccion}`,pagination)
      .pipe(
        takeUntil(this.destroy$),
        //catchError((err:any) => {
        //  console.log(err);
        //  return EMPTY;
        //  /*
        //  return throwError(() => {
        //    return new Error('No Anduvo');
        //  });
        //  */
        //})
      )
      .subscribe( res => {
        //console.log(res);
        if(res.count) this.emptyData = false;
        this.count = res.count;
        this.offset = res.offset;
        this.nextOffset = res.nextOffset;
        res.rows.map( (item:iAbmFd) => {
          const params = {
            file: this.rtData.coleccion,
            _id: item._id
          }
          this.api.get(`/articulos/file`,params)
          .pipe(takeUntil(this.destroy$))
          .subscribe( res => {
            console.log(res)
            item.uso = res.length;
          });

        })
        this.listData = this.listData.concat(res.rows);
        this.loading = false;
        setTimeout(() => {
          const elem = document.getElementsByClassName('main')[0];
          if(elem.scrollHeight === elem.clientHeight && this.nextOffset ){
            if(this.count > 0 && this.nextOffset) this.readData();
          }
        }, 50);
      })
    } catch (error) {
      console.log(error)
    }
  }

  readNewData(){
    this.count = 0;
    this.offset = 0;
    this.nextOffset = 0;
    this.scrollTop = 0;
    this.listData = [];
    this.readData();
  }

  /*
  cambioMain(){
    const elem = document.getElementsByClassName('main')[0];
    console.log(elem.scrollHeight);
    console.log(elem.clientHeight);
    if(elem.scrollHeight === elem.clientHeight){
      //this.readData();
    }
  }
  */
  edit(item:number){
    console.log(item);
    const params = this.setState();
    this._router.navigate(['maestro/edit'], { state: {item, ...params}})
  }
  nuevo(){
    console.log(this.searcher.value)
    const item = -1;
    const newData = {
      name:this.searcher.value
    }
    const params = this.setState();
    this._router.navigate(['maestro/edit'], {state: {item, newData, ...params}})
  }
  async borrar(item:number){
    console.log(item);
    const params = {
      file: this.rtData.coleccion,
      _id: this.listData[item]._id
    }
    const uso = await this.api.getP(`/articulos/file`,params);
    console.log(uso);
    const total = uso.length;
    console.log('usado en %d articulos',total);
    const p = confirm(`Desea borrar ${this.listData[item].name}\nId: ${this.listData[item]._id}`)
    if (p)
      this.api.delete(`/mabm/${this.rtData.coleccion}/${this.listData[item]._id}`)
      .subscribe(res => {
        console.log(res)
        this.listData.splice(item,1);
      })
  }
  setState(){
    return ({
      from: this._location.path(true),
      scrollTop: this.scrollTop,
      rtData: this.rtData,
      listData: this.listData,
      count: this.count,
      offset: this.offset,
      searchItem: this.searchItem,
      nextOffset: this.nextOffset,
    })
  }
}
