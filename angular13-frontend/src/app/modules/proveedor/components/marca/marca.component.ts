import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
 
import { Subject, takeUntil, noop, Observable, Observer, of, Subscriber } from 'rxjs';
import { map, switchMap, tap, mergeMap  } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

const ORI_API = environment.API_URL

interface fabricanteResponse {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number;
  sort: object;
  count: number;
  apiTime: number;
  filter: object;
  data: fabricanteFD[];
  message: string;
}

interface fabricanteFD {
  _id: string;
  name: string;
  marcas: [];
  images: any[];
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
  fabricante_id: string;
  fabircante: string;
  images: any[];
}


interface prodNameResponse {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number;
  sort: object;
  count: number;
  apiTime: number;
  filter: object;
  data: prodName[];
  message: string;
}

interface prodName {
  art_name: string;
  contiene: number;
  ean: string;
  edad: string;
  especie: string;
  fabricante: string;
  fullname: string;
  image: string;
  linea: string;
  marca: string;
  oferta: boolean;
  oferta_desde: any;
  oferta_hasta: any;
  oferta_precio: number;
  pCompra: boolean;
  pVenta: boolean;
  plu: number;
  precio: number;
  prodName: string;
  raza: string;
  rubro: string;
  stock: number;
  tags: string;
  unidad: string;
  _id: string;
}

interface articuloResponse {
  url: string;
  limit: number;
  offset: number;
  nextOffset: number;
  sort: object;
  count: number;
  apiTime: number;
  filter: object;
  data: articulo[];
  message: string;
}

interface articulo {
  beneficios: [];
  d_edad: boolean;
  d_especie: boolean;
  d_fabricante: boolean;
  d_linea: boolean;
  d_marca: boolean;
  d_raza: boolean;
  d_rubro: boolean;
  detalles: string;
  edad: string;
  especie: string;
  especia_id: string;
  fabricante: string;
  fabricante_id: string;
  formula: [];
  fullName: string;
  image: string;
  images: [];
  iva: number;
  linea: string;
  linea_id: string;
  marca: string;
  marca_id: string;
  margen: number;
  name: string;
  presentaciones: [];
  private_web: boolean;
  rubro: string;
  rubro_id: string;
  tags: string;
  url: string;
  videos: [];
  _id: string;
}

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css']
})

export class MarcaComponent implements OnInit, OnDestroy {
  proveedorId?: string;
  selected?: any[];
  newData:any[] = [];
  provData:any[] = [];

  fabricanteSelected?: string;
  fabricanteSource$?: Observable<fabricanteFD[]>;
  fabricanteLoading?: boolean;
  fabricanteSelectedOption: any;
  fabricantePreviewOption?: any;

  marcaSelected?: string;
  marcaSource$?: Observable<marcaTypeAhead[]>;
  marcaLoading?: boolean;
  marcaSelectedOption: any;
  marcaPreviewOption?: any;

  articuloSelected?: string;
  articuloSource$?: Observable<articulo[]>;
  articuloLoading?: boolean;
  articuloSelectedOption: any;
  articuloPreviewOption?: any;

  prodNameSelected?: string;
  prodNameSource$?: Observable<prodName[]>;
  prodNameLoading?: boolean;
  prodNameSelectedOption: any;
  prodNamePreviewOption?: any;

  private destroy$ = new Subject<any>();

  constructor(
    private apiServ: ApiService, 
    private router: Router, 
    ) { }

    ngOnInit(): void {
    this.fabricanteSource$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.fabricanteSelected);
    }).pipe(
      switchMap(( query: string ) => {
        if(query) {
          return this.apiServ.get('/fabricantes',{searchItem: query, limit: 100},{spinner: 'false'})
            .pipe(
              map((ret:fabricanteResponse) => ret && ret.data || [])
            )
        }
        return of([]);
      })
    );
    this.marcaSource$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.marcaSelected);
    }).pipe(
      switchMap(( query: string ) => {
        if(query) {
          return this.apiServ.get('/marcas/tah',{searchItem: query, fabricante_id: this.fabricanteSelectedOption?._id, limit: 100},{spinner: 'false'})
            .pipe(
              map((ret:marcaTypeAheadResponse) => ret && ret.data || [])
            )
        }
        return of([]);
      })
    );
    this.articuloSource$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.articuloSelected);
    }).pipe(
      switchMap(( query: string ) => {
        if(query) {
          return this.apiServ.get('/articulos',{ searchItem: query, fabricante_id: this.fabricanteSelectedOption?._id, marca_id: this.marcaSelectedOption?._id, limit: 100 },{spinner: 'false'})
            .pipe(
              map((ret:articuloResponse) => ret && ret.data || [])
            )
        }
        return of([]);
      })
    );
    this.prodNameSource$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.prodNameSelected);
    }).pipe(
      switchMap(( query: string ) => {
        if(query) {
          return this.apiServ.get('/productoname',{searchItem: query, fabricante_id: this.fabricanteSelectedOption?._id, marca_id: this.marcaSelectedOption?._id, articulo: this.articuloSelectedOption?._id, pesable: false, limit: 100},{spinner: 'false'})
            .pipe(
              map((ret: prodNameResponse) => ret && ret.data || [])
            )
        }
        return of([]);
      })
    );

    this.proveedorId = this.router.routerState.snapshot.url.split('/')[2];
    this.apiServ.get(`/proveedor/${this.proveedorId}/marcas/rel`)
        .subscribe((retData:any) => {
          this.provData = retData.provdata;
          console.log(retData);
        });
  }

  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }
  
  readNewData() {
    console.log(this.articuloSelectedOption);
    this.apiServ.get('/productoname',
      {
        fabricante_id: this.fabricanteSelectedOption?._id, 
        marca_id: this.marcaSelectedOption?._id, 
        articulo: this.articuloSelectedOption?._id, 
        //_id: this.prodNameSelectedOption?._id, 
        pesable: false, 
        limit: 250
      }
      ,{spinner: 'false'}
    ).subscribe( 
      (retData) => {
        console.log(retData);
        this.newData = retData.data
      }
    )
  }

  changeFabricanteLoading(e: boolean): void {
    this.fabricanteLoading = e;
    if(this.fabricanteSelectedOption){
      this.fabricanteSelectedOption = null;
      this.readNewData();      
    }
    console.log('changeFabricanteLoading',this.fabricanteLoading);
  }
  
  onFabricanteSelect(event: TypeaheadMatch): void {
    this.fabricanteSelectedOption = event.item;
    this.readNewData();
    console.log(this.fabricanteSelectedOption)
  }
 
  onFabricantePreview(event: TypeaheadMatch): void {
    if (event) {
      this.fabricantePreviewOption = event.item;
    } else {
      this.fabricantePreviewOption = null;
    }
    console.log(this.fabricantePreviewOption);
  }

  changeMarcaLoading(e: boolean): void {
    this.marcaLoading = e;
    if(this.marcaSelectedOption){
      this.marcaSelectedOption = null;
      this.readNewData();      
    }
    
    console.log('changeMarcaLoading',this.marcaLoading);
  }
  
  onMarcaSelect(event: TypeaheadMatch): void {
    this.marcaSelectedOption = event.item;
    this.readNewData();
    console.log(this.marcaSelectedOption)
  }
 
  onMarcaPreview(event: TypeaheadMatch): void {
    if (event) {
      this.marcaPreviewOption = event.item;
    } else {
      this.marcaPreviewOption = null;
    }
    console.log(this.marcaPreviewOption);
  }

  changeArticuloLoading(e: boolean): void {
    this.articuloLoading = e;
    if(this.articuloSelectedOption){
      this.articuloSelectedOption = null;
      this.readNewData();
    }
    console.log('changeArticuloLoading',this.articuloLoading);
  }
  
  onArticuloSelect(event: TypeaheadMatch): void {
    this.articuloSelectedOption = event.item;
    this.readNewData();
    console.log(this.articuloSelectedOption)
  }
 
  onArticuloPreview(event: TypeaheadMatch): void {
    if (event) {
      this.articuloPreviewOption = event.item;
    } else {
      this.articuloPreviewOption = null;
    }
    console.log(this.articuloPreviewOption);
  }

  changeProdNameLoading(e: boolean): void {
    this.prodNameLoading = e;
    if(this.prodNameSelectedOption){
      this.prodNameSelectedOption = null;
      this.readNewData();
    }
    console.log('changeProdNameLoading',this.prodNameLoading);
  }
  
  onProdNameSelect(event: TypeaheadMatch): void {
    this.prodNameSelectedOption = event.item;
    console.log(this.prodNameSelectedOption)
  }
 
  onProdNamePreview(event: TypeaheadMatch): void {
    if (event) {
      this.prodNamePreviewOption = event.item;
    } else {
      this.prodNamePreviewOption = null;
    }
    console.log(this.prodNamePreviewOption);
  }

}
