import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TypeaheadMatch, TypeaheadOrder } from 'ngx-bootstrap/typeahead';
import { map, Observable, Observer, of, Subject, switchMap } from 'rxjs';
import { ArticuloFd, ArticuloResponse } from 'src/app/models/articulo';
import { ApiService } from 'src/app/services/api.service';

interface prodNameResponse {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number;
  sort: object;
  count: number;
  apiTime: number;
  filter: object;
  rows: prodName[];
  message: string;
}

interface prodName {
  _id: string;
  articulo: any;
  fabricante: any;
  marca: any;
  rubro: any;
  linea: string;
  especie: string;
  edad: string;
  raza: string;
  contiene: number;
  ean: string;

  fullname: string;
  art_name: string;
  prodName: string;
  image: string;
  oferta: boolean;
  oferta_desde: any;
  oferta_hasta: any;
  oferta_precio: number;
  pCompra: boolean;
  pVenta: boolean;
  plu: number;
  precio: number;
  stock: number;
  tags: string;
  unidad: string;
}

interface proveedorResponse {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number;
  sort: object;
  count: number;
  apiTime: number;
  filter: object;
  rows: proveedor[];
  message: string;
}

interface proveedor {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-listas-precios',
  templateUrl: './listas-precios.component.html',
  styleUrls: ['./listas-precios.component.css']
})
export class ListasPreciosComponent implements OnInit {
  private destroy$ = new Subject<any>();

  newData:any[] = [];
  productosCount:number = 0;
  title='Listas'
  prodNameSelected?: string;
  prodNameSource$?: Observable<prodName[]>;
  prodNameLoading?: boolean;
  prodNameSelectedOption: any;
  prodNamePreviewOption?: any;

  proveedorSelected?: string;
  proveedorSource$?: Observable<proveedor[]>;
  proveedorLoading?: boolean;
  proveedorSelectedOption: any;
  proveedorPreviewOption?: any;

  constructor(
    private apiServ: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.prodNameSource$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.prodNameSelected);
    }).pipe(
      switchMap(( query: string ) => {
        if(query) {
          return this.apiServ.get('/productoname',{searchItem: query, pesable: false, limit: 100},{spinner: 'false'})
            .pipe(
              map((ret: prodNameResponse) => ret && ret.rows || [])
            )
        }
        return of([]);
      })
    );
    this.proveedorSource$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.proveedorSelected);
    }).pipe(
      switchMap(( query: string ) => {
        if(query) {
          return this.apiServ.get('/proveedores',{searchItem: query, limit: 25},{spinner: 'false'})
            .pipe(
              map((ret: proveedorResponse) => ret && ret.rows || [])
            )
        }
        return of([]);
      })
    );

  }
  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }

  readNewData() {
    this.apiServ.get('/productoname',
      {
        //_id: this.prodNameSelectedOption?._id,
        pesable: false,
        limit: 500
      }
      ,{spinner: 'false'} )
      .subscribe(
        (retData) => {
          this.newData = retData.rows;
          console.log(retData);
          this.removeIsExists();
        }
      )
  }

  readProvData() {
    this.apiServ.get('/productoname',
      {
        //_id: this.prodNameSelectedOption?._id,
        limit: 25
      }
      ,{spinner: 'false'} )
      .subscribe(
        (retData) => {
          this.newData = retData.rows;
          console.log(retData);
          this.removeIsExists();
        }
      )
  }

  changeProdNameLoading(e: boolean): void {
    this.prodNameLoading = e;
    if(this.prodNameSelectedOption){
      this.prodNameSelectedOption = null;
      //this.readProvData();
    }
    console.log('changeProdNameLoading',this.prodNameLoading);
  }

  onProdNameSelect(event: TypeaheadMatch): void {
    console.log(event);
    this.prodNameSelectedOption = event.item;
    console.log(this.prodNameSelectedOption);
  }

  onProdNamePreview(event: TypeaheadMatch): void {
    console.log(event);
    if (event) {
      this.prodNamePreviewOption = event.item;
    } else {
      this.prodNamePreviewOption = null;
    }
    console.log(this.prodNamePreviewOption);
  }

  changeProveedorLoading(e: boolean): void {
    this.proveedorLoading = e;
    //if(this.proveedorSelectedOption){
      this.proveedorSelectedOption = null;
      //this.readProvData();
    //}
    console.log('changeProveedorLoading',this.proveedorLoading);
  }

  onProveedorSelect(event: TypeaheadMatch): void {
    this.proveedorSelectedOption = event.item;
    //console.log('SelectEvt',this.proveedorSelectedOption);
    //this.loadProveedorData();
  }

  onProveedorPreview(event: TypeaheadMatch): void {
    this.proveedorSelectedOption = null;
    if (event) {
      this.proveedorPreviewOption = event.item;
    } else {
      this.proveedorPreviewOption = null;
    }
    //console.log('PreviewEvt',this.proveedorPreviewOption);
  }

  removeIsExists(){
    /*
    if(this.provData)
    this.provData.map(provItem => {
      const idx = this.newData.findIndex( reg => provItem.presentacion._id === reg._id);
      if(idx > -1){
        this.newData.splice( idx, 1);
      }
    })
    */
  }

}
