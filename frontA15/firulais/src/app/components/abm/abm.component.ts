import { Component, HostListener, importProvidersFrom, inject, NgModule, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormArray, FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TypeaheadMatch, TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { map, Observable, Observer, of, Subject, switchMap, takeUntil } from 'rxjs';
import { iAbmFd, iAbmResponse } from 'src/app/models/abm';

@Component({
  selector: 'app-abm',
  standalone: true,
  providers:[
    //NgbTooltip,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule,
  ],
  templateUrl: './abm.component.html',
  styleUrls: ['./abm.component.css']
})

export class AbmComponent implements OnInit, OnDestroy {
  rows: any = [];
  searchItem='';
  limit = 50;
  count = 0;
  offset = 0;
  nextOffset: number | boolean = 0;
  loading = false;
  fileName:string = '';
  noResult = false;
  Selected?: string;
  Source$!: Observable<iAbmFd[]>;
  Loading?: boolean;
  SelectedOption: any;
  PreviewOption?: any;
  allData: any[] = [];

  getUrl:string = '';
  postUrl:string = '';
  placeholder = '';
  title = '';
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    images: new FormArray([]),
    icons: new FormArray([])
  })
  private destroy$ = new Subject<any>();
  router = inject(ActivatedRoute);
  api = inject(ApiService);

  @HostListener('scroll', ['$event'])
  onScroll( elem:any ) {
    if(elem.target.scrollTop > ( elem.target.scrollHeight - elem.target.offsetHeight - 100) ) {
      if( this.nextOffset !== false ) this.readAllData();
    }
  }

  ngOnInit(): void {
    this.getUrl = `/${this.router.snapshot.data['getData']}`;
    this.postUrl = `/${this.router.snapshot.data['postData']}`;
    this.placeholder = this.router.snapshot.data['placeholder'];
    this.Source$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.Selected);
    }).pipe(
      switchMap(( query: string ) => {
        if(query) {
          return this.api.get(this.getUrl,
            {searchItem: query, limit: this.limit},
            {spinner: 'false'}
            )
            .pipe(
              map((ret:iAbmResponse) => ret && ret.rows || [])
            )
        }
        return of([]);
      })
    );
    this.readAllData();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  readAllData(){
    this.api.get(this.getUrl,
      {
        limit: this.limit,
        offset: this.nextOffset,
        searchItem: this.searchItem
      }
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe( res => {
      console.log(res);
      this.count = res.count;
      this.offset = res.offset;
      this.nextOffset = res.nextOffset;
      this.allData = this.allData.concat(res.rows);
    })
  }
  readNewData(){
    this.count = 0;
    this.offset = 0;
    this.nextOffset = 0;
    this.allData = [];
    this.readAllData();
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
    console.log('No Result',event);
  }

  changeLoading(e: boolean): void {
    this.Loading = e;
    if(this.SelectedOption){
      this.SelectedOption = null;
    }
    this.searchItem = this.Selected || '';
    this.readNewData();
    console.log('changeLoading',this.Loading);
  }

  onSelect(event: TypeaheadMatch): void {
    this.SelectedOption = event.item;
    //this.readNewData();
    console.log('onSelect',this.SelectedOption);
  }

  onPreview(event: TypeaheadMatch): void {
    if (event) {
      this.PreviewOption = event.item;
    } else {
      this.PreviewOption = null;
    }
    console.log('onPreview',this.PreviewOption);
  }

  Addreg(){
    console.log(this.Selected);
    this.api.post(`${this.postUrl}`,{name: this.Selected})
      .subscribe((retData:any) => {
        console.log(retData);
        this.allData.push(retData.value)
      })
  }
}
