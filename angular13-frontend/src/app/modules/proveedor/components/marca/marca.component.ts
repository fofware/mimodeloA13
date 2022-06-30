import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
 
import { Subject, takeUntil, noop, Observable, Observer, of, Subscriber } from 'rxjs';
import { map, switchMap, tap, mergeMap  } from 'rxjs/operators';

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

export class DemoTypeaheadAsyncComponent {
}

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css']
})



export class MarcaComponent implements OnInit, OnDestroy {
  search?: string;
  suggestions$?: Observable<GitHubUser[]>;
  errorMessage?: string;

  asyncSelected?: string;
  dataSource!: Observable<DataSourceType[]>;
  typeaheadLoading?: boolean;
  statesComplex: DataSourceType[] = [
    { id: 1, name: 'Alabama', region: 'South' },
    { id: 2, name: 'Alaska', region: 'West' },
    { id: 3, name: 'Arizona', region: 'West' },
    { id: 4, name: 'Arkansas', region: 'South' },
    { id: 5, name: 'California', region: 'West' },
    { id: 6, name: 'Colorado', region: 'West' },
    { id: 7, name: 'Connecticut', region: 'Northeast' },
    { id: 8, name: 'Delaware', region: 'South' },
    { id: 9, name: 'Florida', region: 'South' },
    { id: 10, name: 'Georgia', region: 'South' },
    { id: 11, name: 'Hawaii', region: 'West' },
    { id: 12, name: 'Idaho', region: 'West' },
    { id: 13, name: 'Illinois', region: 'Midwest' },
    { id: 14, name: 'Indiana', region: 'Midwest' },
    { id: 15, name: 'Iowa', region: 'Midwest' },
    { id: 16, name: 'Kansas', region: 'Midwest' },
    { id: 17, name: 'Kentucky', region: 'South' },
    { id: 18, name: 'Louisiana', region: 'South' },
    { id: 19, name: 'Maine', region: 'Northeast' },
    { id: 21, name: 'Maryland', region: 'South' },
    { id: 22, name: 'Massachusetts', region: 'Northeast' },
    { id: 23, name: 'Michigan', region: 'Midwest' },
    { id: 24, name: 'Minnesota', region: 'Midwest' },
    { id: 25, name: 'Mississippi', region: 'South' },
    { id: 26, name: 'Missouri', region: 'Midwest' },
    { id: 27, name: 'Montana', region: 'West' },
    { id: 28, name: 'Nebraska', region: 'Midwest' },
    { id: 29, name: 'Nevada', region: 'West' },
    { id: 30, name: 'New Hampshire', region: 'Northeast' },
    { id: 31, name: 'New Jersey', region: 'Northeast' },
    { id: 32, name: 'New Mexico', region: 'West' },
    { id: 33, name: 'New York', region: 'Northeast' },
    { id: 34, name: 'North Dakota', region: 'Midwest' },
    { id: 35, name: 'North Carolina', region: 'South' },
    { id: 36, name: 'Ohio', region: 'Midwest' },
    { id: 37, name: 'Oklahoma', region: 'South' },
    { id: 38, name: 'Oregon', region: 'West' },
    { id: 39, name: 'Pennsylvania', region: 'Northeast' },
    { id: 40, name: 'Rhode Island', region: 'Northeast' },
    { id: 41, name: 'South Carolina', region: 'South' },
    { id: 42, name: 'South Dakota', region: 'Midwest' },
    { id: 43, name: 'Tennessee', region: 'South' },
    { id: 44, name: 'Texas', region: 'South' },
    { id: 45, name: 'Utah', region: 'West' },
    { id: 46, name: 'Vermont', region: 'Northeast' },
    { id: 47, name: 'Virginia', region: 'South' },
    { id: 48, name: 'Washington', region: 'South' },
    { id: 49, name: 'West Virginia', region: 'South' },
    { id: 50, name: 'Wisconsin', region: 'Midwest' },
    { id: 51, name: 'Wyoming', region: 'West' }
  ];

  proveedores:any;
  data:any[] = [];
  loading = false;
  offset: number | boolean = 0;
  nextOffset: number | boolean = 0;
  count = 0;
  limit = 50;
  searchItem = '';
  proveedorId= '';
  
  toSelect = [];
  selected = [];

  private destroy$ = new Subject<any>();

  constructor(
    private apiServ: ApiService, 
    private router: Router, 
    private actRt: ActivatedRoute,
    private http: HttpClient
    ) { 
      this.dataSource = new Observable((observer: Subscriber<string>) => {
        // Runs on every search
        observer.next(this.asyncSelected);
      })
        .pipe(
          mergeMap((token: string) => this.getStatesAsObservable(token))
        );
    }

  ngOnInit(): void {
    this.suggestions$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.search);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          return this.http.get<GitHubUserSearchResponse>(
            'https://api.github.com/search/users', {
            params: { q: query }
          }).pipe(
            map((data: GitHubUserSearchResponse) => data && data.items || []),
            tap(() => noop, err => {
              // in case of http error
              this.errorMessage = err && err.message || 'Something goes wrong';
            })
          );
        }
 
        return of([]);
      })
    );

    console.log(this.router.routerState.snapshot.url.split('/'));
    this.proveedorId = this.router.routerState.snapshot.url.split('/')[2];
    const allData = this.apiServ.get(`/proveedor/${this.proveedorId}/marcas/rel`)
          .subscribe((retData:any) => {
            this.toSelect = retData.marcaFree;
            this.selected = retData.provdata;
            console.log(retData);
          })

  }

  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
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
  getStatesAsObservable(token: string): Observable<DataSourceType[]> {
    const query = new RegExp(token, 'i');
 
    return of(
      this.statesComplex.filter((state: DataSourceType) => {
        return query.test(state.name);
      })
    );
  }
 
  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }
}
