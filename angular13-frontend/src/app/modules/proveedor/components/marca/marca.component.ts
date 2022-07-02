import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
 
import { Subject, takeUntil, noop, Observable, Observer, of, Subscriber } from 'rxjs';
import { map, switchMap, tap, mergeMap  } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

const ORI_API = environment.API_URL

interface GitHubUserSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}
 
interface GitHubUser {
  login: string;
  id:  number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  received_events_url: string;
  type: string;
  score: number;
}

interface DataSourceType {
  id: number; 
  name: string; 
  region: string; 
}

interface marcaTypeAheadResponse {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number;
  sort: object;
  count: number;
  apiTime: number;
  filter: object;
  data: marcaTypeAhead[];
  message: string;
}

interface marcaTypeAhead {
  _id: string;
  name: string;
  fabircante: string;
  images: any[];
}


@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css']
})

export class MarcaComponent implements OnInit, OnDestroy {
  marcaSelected?: string;
  marcaSource$?: Observable<marcaTypeAhead[]>;
  marcaLoading?: boolean;
  asyncSelected?: string;

  proveedores:any;
  data:any[] = [];
  loading = false;
  offset: number | boolean = 0;
  nextOffset: number | boolean = 0;
  count = 0;
  limit = 50;
  searchItem = '';
  proveedorId= '';
  
  toSelect:marcaTypeAhead[] = [];
  selected = [];
  selectedOption: any;
  previewOption?: any;

  private destroy$ = new Subject<any>();

  constructor(
    private apiServ: ApiService, 
    private router: Router, 
    ) { }


    changeMarcaLoading(e: boolean): void {
      this.marcaLoading = e;
      console.log('changeMarcaLoading',this.marcaLoading);
    }

    ngOnInit(): void {
    this.marcaSource$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.marcaSelected);
    }).pipe(
      switchMap(( query: any ) => {
        if(query) {
          return this.apiServ.get('/marcas',{searchItem: query},{spinner: 'false'})
            .pipe(
              map((ret:marcaTypeAheadResponse) => ret && ret.data || [])
            )
        }
        return of([]);
      })
    );
    this.proveedorId = this.router.routerState.snapshot.url.split('/')[2];
    const allData = this.apiServ.get(`/proveedor/${this.proveedorId}/marcas/rel`)
          .subscribe((retData:any) => {
            this.selected = retData.provdata;
            console.log(retData);
          });
  }

  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }
  
  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
    console.log(this.selectedOption)
  }
 
  onPreview(event: TypeaheadMatch): void {
    if (event) {
      this.previewOption = event.item;
    } else {
      this.previewOption = null;
    }
    console.log(this.previewOption);
  }

  setData(){
    //if(this.loading) return;
    //if(this.nextOffset === false) return;
    //this.loading = true;
    //const params = {
    //  limit: this.limit,
    //  offset: this.nextOffset,
    //  searchItem: this.searchItem
    //};
    //this.apiServ.get('/proveedor/marcas',params).subscribe((data:any) => {
    //  console.log(data);
    //  this.count = data.count;
    //  this.offset = data.offset;
    //  this.nextOffset = data.nextOffset;
    //  this.data = this.data.concat(data.data);
    //  console.log(this.data.length);
    //  console.log(data.apiTime);
    //  this.loading = false;
    //  if(this.count === 0){
    //    this.router.navigate(['proveedores','new'])
    //  }
    //});
  }
}
