import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DraggableItemService, SortableModule } from 'ngx-bootstrap/sortable';
import { Observable, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-articulos-sortable-name',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SortableModule
  ],
  providers:[
    DraggableItemService
  ],
  templateUrl: './articulos-sortable-name.component.html',
  styleUrls: ['./articulos-sortable-name.component.css'],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ArticulosSortableNameComponent implements OnInit {
  emiter:any;
  templateData = [
    'fabricante',
    'marca',
    'modelo',
    'name',
    'especie',
    'edad',
    'talla',
    'rubro',
    'linea',
  ]
  isLoaded = false;
  showItems:any[] = [];
  hidenItems:any[] = [];

  @Input() data!:any;
  @Output() dataChange = new EventEmitter<any>();
  @Input() reset: Observable<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.setData();
    this.reset.pipe(
      tap(data => console.log(data))
    ).subscribe(response => {
      //console.log('reset',response);
      if(response && this.isLoaded){
        this.showItems = [];
        this.hidenItems = [];
        this.setData();
        //this.dataChange.emit(this.data);
      }
    });
    this.isLoaded = true;
  }


  //ngOnChanges(changes: SimpleChanges): void {
  //  console.log('SortableChages',changes);
  //  /*
  //  this.showItems = [];
  //  this.hidenItems = [];
  //  this.setData();
  //  this.dataChange.emit(this.data);
  //  */
  //}

  setData(): void {
    this.data.showName.map( (src:string) => {
      switch (src) {
        case 'name':
          if(this.data.name.length){
            this.showItems.push({ field: 'name', _id: null, name: this.data.name});
          }
          break;
        default:
          this.showItems.push({ field: src, ...this.data[src]});
          break;
      }
    })
    this.templateData.map( async src => {
      let itdata = null;
      //this.showItems = [];
      //this.hidenItems = [];

      const found = this.data.showName.includes(src);
      switch (src) {
        case 'name':
          if(this.data.name.length)
            if(found){
              //this.showItems.push({ field: 'name', _id: null, name: this.data.name});
            } else {
              this.hidenItems.push({ field: 'name', _id: null, name: this.data.name});
            }

          //itdata = { field: 'name', _id: null, name: this.data.name}
          break;
        default:
          if(this.data[src]?.name.length)
            if(found){
              //this.showItems.push({ field: src, ...this.data[src]});
            } else {
              this.hidenItems.push({ field: src, ...this.data[src]});
            }
          /*
          if(this.data[src])
            itdata = { field: src, ...this.data[src] }
          break;
          */
      }

    })

  }

  onChange(e:any){
    if(this.emiter){
      clearTimeout(this.emiter);
    }

    let changed = false;
    //console.log(e);
    if(this.showItems.length === this.data.showName.length){
      for (let i = 0; i < this.showItems.length; i++) {
        //console.log( this.showItems[i].field, "=", this.data.showName[i])
        if(this.showItems[i].field != this.data.showName[i]){
          changed = true;
          break;
        }
      }
    } else {
      changed = true;
    }
    if(changed){
      this.data.showName = this.showItems.map( item => item.field);
      console.log(this.data.showName);
      this.dataChange.emit(this.data);
      //console.log(this.data.showName);
      //this.emiter = setTimeout(() => {
      //  this.dataChange.emit(this.data);
      //}, 1);
    }
  }
}
