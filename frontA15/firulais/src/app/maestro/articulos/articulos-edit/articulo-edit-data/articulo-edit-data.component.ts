import { Component, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, noop, Observable, Observer, of, Subject, switchMap, takeUntil, takeWhile, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ArticulosTypeaheadAddComponent } from '../articulos-typeahead-add/articulos-typeahead-add.component';
import { ArticulosSortableNameComponent } from '../articulos-sortable-name/articulos-sortable-name.component';
import { ArticuloService } from '../../articulo-edit.service';
import { maestroArticuloFd } from 'src/app/maestro/models/maestro.model.articulo';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { iAbmFd, iAbmResponse } from 'src/app/maestro/models/abm';
import { HttpClient } from '@angular/common/http';

//https://www.facebook.com/fabianomar.franzotti/photos_by

/*
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
*/
@Component({
  selector: 'app-articulo-edit-data',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule,
    ArticulosTypeaheadAddComponent,
    ArticulosSortableNameComponent,
  ],
  templateUrl: './articulo-edit-data.component.html',
  styleUrls: ['./articulo-edit-data.component.css']
})

export class ArticuloEditDataComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  _arouter = inject(ActivatedRoute);
  _api = inject(ApiService);
  _location = inject(Location);
  _artSvc = inject(ArticuloService);
  http = inject(HttpClient);
/*
  fg = new FormGroup({
    name: new FormControl(''),
    url: new FormControl(''),
    detalles: new FormControl(''),
    fabricante: new FormControl('')
  })
  fabricanteSource$!: Observable<iAbmFd[]>;
  fabricante!:string;
*/
  limit = 100;
  filesData!:any;
  //filesReady$ = this._artSvc.filesReady$;
  filesData$ = this._artSvc.filesData$;
  //ready!:boolean;
  resetSortableSubject = new Subject<boolean>();
  articulo$ = this._artSvc.articuloSelected$
  articulo!:maestroArticuloFd | any;

  /*
  search?: string;
  suggestions$?: Observable<GitHubUser[]>;
  errorMessage?: string;
  */
  ngOnInit(): void {
    console.log('articuloSeleccionado',this.articulo$.value);
    this.articulo = this._artSvc.articuloSelected$.value;
    this._artSvc.articuloChanged$.next(false);
    // this.fg.patchValue(this._artSvc.articuloSelected$.value as any);
    this.filesData$
      .pipe(
        takeUntil(this.destroy$),
        tap( ret =>{ console.log('ASDFASDFASDF',ret); })
      ).subscribe();
    if(!this._artSvc.filesReady$.value) this._artSvc.readFiles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('onChanges',changes);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changedata(data:any){
    console.log(data);
    this.articulo.sText = [];
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        let reg = data[key];
        //if(this.articulo[key]){
          switch (key) {
            case 'showName':
              this.articulo[key] = reg;
              break;
            case 'name':
              this.articulo[key] = reg.trim();
              /*
              reg = reg.trim().toLowerCase();
              if(reg !== '' && reg !== null){
                this.articulo.sText.push(reg);
              }
              */
              break;
            default:
              this.articulo[key] = reg._id;
              //reg.name = reg.name.trim().toLowerCase();
              if(reg.name.trim() !== '' && reg._id !== null){
                this.articulo.sText.push(reg.name.trim());
              }
              break;
          }
        //}
      }
    }
    this.articulo.fullname = '';
    let sep=''
    this.articulo.showName.map((key:string) => {
      console.log(key);
      if(key === 'name')
        this.articulo.fullname += `${sep}${data[key]}`;
      else
        this.articulo.fullname += `${sep}${data[key].name}`;
      sep=' ';
    });

    console.log('CHANGE_DATA articulo', this.articulo);
    this.articulo$.next(this.articulo);
  }

  sortableChange(e:any){
    console.log('sortableChange',e);
    this.changedata(e);
    this._artSvc.checkChanges();
  }

  changeName(e:any){
    this._artSvc.articuloSelected$.value.name = e;
    this._artSvc.filesData$.value.name = e;
    this.changedata(this._artSvc.filesData$.value);
    this.resetSortableSubject.next(true);
    this._artSvc.checkChanges();
  }

  changeField(e:any){
    console.log('changeField',e);
    this.filesData$.value[e.field] = e.value;
    this.resetSortableSubject.next(true);
    this.changedata(this.filesData$.value);
    this._artSvc.checkChanges();
  }
}
