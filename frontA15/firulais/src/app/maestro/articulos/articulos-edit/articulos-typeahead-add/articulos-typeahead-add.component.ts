import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, Observer, of, Subject, switchMap } from 'rxjs';
import { iAbmFd, iAbmResponse } from 'src/app/maestro/models/abm';
import { ApiService } from 'src/app/services/api.service';
import { TypeaheadMatch, TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-articulos-typeahead-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TypeaheadModule
  ],

  templateUrl: './articulos-typeahead-add.component.html',
  styleUrls: ['./articulos-typeahead-add.component.css'],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class ArticulosTypeaheadAddComponent {
  //rows: any = [];
  /**
   * TypeAhead parameters
   */
  limit = 20;
  loading = false;
  noResult = false;
  Source$!: Observable<iAbmFd[]>;
  Loading?: boolean;
  Selected?: string;
  PreviewOption?: any;
  SelectedOption?:any;
  allData: any[] = [];

  @Input() readUrl!:string;
  @Input() addUrl!:string;
  @Input() placeholder!:string;
  //@Input() searchItem!:any;
  @Input() regItem:any;
  @Input() field!:string;
  @Input() class!:any;
  @Output () changeValue = new EventEmitter<any>();

  private destroy$ = new Subject<any>();
  _api = inject(ApiService);

  ngOnInit(): void {
    this.Selected = this.regItem ? this.regItem.name : null;
    this.Source$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.Selected);
    }).pipe(
      switchMap(( query: string ) => {
        if(query) {
          return this._api.get(`${this.readUrl}`,
            {searchItem: query, limit: this.limit},
            {spinner: 'true'}
            )
            .pipe(
              map((ret:iAbmResponse) => ret && ret.rows || [])
            )
        }
        return of([]);
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  typeaheadNoResults(event: boolean): void {
    console.log(`No Result ${this.field}`,event);
    console.log('selected',`'${this.Selected}'`);
    //this.noResult = event;
    //this.changeValue.emit({field:this.field, value:this.SelectedOption});
  }

  changeLoading(e: boolean): void {
    console.log(`changeLoading ${this.field}`,e);
    this.Loading = e;
    console.log('selected',`'${this.Selected}'`);
    console.log(this.SelectedOption);

    /*
    if(this.SelectedOption){
      this.SelectedOption = null;
    }
    */
    //this.searchItem = this.Selected || '';
  }

  onSelect(event: TypeaheadMatch): void {
    console.log('onSelect',event);

    this.SelectedOption = event.item;
//    console.log('onSelect',this.SelectedOption);
    this.changeValue.emit({field:this.field, value:this.SelectedOption});
  }

  onPreview(event: TypeaheadMatch): void {
    console.log('onPreview',event)
    /*
    if (event) {
      this.PreviewOption = event.item;
    } else {
      this.PreviewOption = null;
    }
    console.log('onPreview',this.PreviewOption);
    */
  }
  onBlur(){
    console.log(`onBlur`);
    console.log(`onBlur selected '${this.Selected}'`);

  }
}
