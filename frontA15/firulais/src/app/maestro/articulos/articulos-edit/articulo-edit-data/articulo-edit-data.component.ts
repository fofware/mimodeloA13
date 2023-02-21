import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ArticulosTypeaheadAddComponent } from '../articulos-typeahead-add/articulos-typeahead-add.component';
import { ArticulosSortableNameComponent } from '../articulos-sortable-name/articulos-sortable-name.component';
import { ArticuloService } from '../../articulo-edit.service';

@Component({
  selector: 'app-articulo-edit-data',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ArticulosTypeaheadAddComponent,
    ArticulosSortableNameComponent,
  ],
  templateUrl: './articulo-edit-data.component.html',
  styleUrls: ['./articulo-edit-data.component.css']
})

export class ArticuloEditDataComponent {
  private destroy$ = new Subject<any>();
  _arouter = inject(ActivatedRoute);
  _api = inject(ApiService);
  _location = inject(Location);
  _artSvc = inject(ArticuloService);

  regData!:any;
  ready$ = this._artSvc.filesReady$;
  files$ = this._artSvc.filesData$;
  ready!:boolean;
  resetSortableSubject = new Subject<boolean>();


  ngOnInit(): void {
    if(!this._artSvc.filesReady$.value) this._artSvc.readFiles();
    this.files$
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => this.regData = data );
    this.ready$
        .pipe(takeUntil(this.destroy$))
        .subscribe( state => this.ready = state );
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  dataChange(e:any){
    console.log('dataChange',e);
    this.regData = e;
    console.log(this.regData);
    this.regData.fullname = '';
    this.regData.showName.map( (n:string) => this.regData.fullname = `${this.regData.fullname} ${this.regData[n].name || this.regData[n]}`)
  }

  changeField(e:any){
    console.log(e);
//    this.ready$ = false;
    this.regData[e.field] = e.value;
    console.log(this.regData);
//    this.ready = true;
    this.resetSortableSubject.next(true);
  }

}
