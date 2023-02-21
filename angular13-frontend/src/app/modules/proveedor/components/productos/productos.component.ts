import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

import { Subject, takeUntil, noop, Observable, Observer, of, Subscriber } from 'rxjs';
import { map, switchMap, tap, mergeMap, timeout  } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TypeaheadMatch, TypeaheadOrder } from 'ngx-bootstrap/typeahead';
import { FabricanteFd, FabricanteResponse } from 'src/app/models/fabricante';
import { MarcaFd, MarcaResponse } from 'src/app/models/marca';
import { ArticuloFd, ArticuloResponse } from 'src/app/models/articulo';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ProveedorProductoFd } from 'src/app/models/proveedor';
import { prodName } from 'src/app/models/produnctoNombre';

const ORI_API = environment.API_URL




interface provProduct {
  _id: string;
  proveedor: string;
  fabricante: string;
  marca: string;
  articulo: string;
  presentacion: string;
  codigo: string;
  v_prodname: [];
  names: [];
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements OnInit {
  proveedorId?: string;
  selected?: any[];
  newData:any[] = [];
  provData:any[] = [];
  filtro: string = '';

  max = 0;
  dynamic = 0;

  marcaCtrl = new UntypedFormControl();

  myForm = new UntypedFormGroup({
    marca: this.marcaCtrl
  });

  fabricanteSelected?: string;
  fabricanteSource$?: Observable<FabricanteFd[]>;
  fabricanteLoading?: boolean;
  fabricanteSelectedOption: any;
  fabricantePreviewOption?: any;

  marcaSelected?: string;
  marcaSource$?: Observable<MarcaFd[]>;
  marcaLoading?: boolean;
  marcaSelectedOption: any;
  marcaPreviewOption?: any;

  articuloSelected?: string;
  articuloSource$?: Observable<ArticuloFd[]>;
  articuloLoading?: boolean;
  articuloSelectedOption: any;
  articuloPreviewOption?: any;
  articuloSort: TypeaheadOrder = {
    direction: 'asc',
    field: 'fullname'
  };
  //
  //prodNameSelected?: string;
  //prodNameSource$?: Observable<prodName[]>;
  //prodNameLoading?: boolean;
  //prodNameSelectedOption: any;
  //prodNamePreviewOption?: any;
  //
  private destroy$ = new Subject<any>();
  allNewValue = false;
  allProvValue = false;

  constructor(
    private apiServ: ApiService,
    private router: Router,
    ) { }
    /*
    @HostListener('scroll', ['$event'])
    onScroll( elem:any ) {
        //console.log('scrollTop',elem.target.scrollTop)
        //console.log('offsetHeight',elem.offsetHeight)
        //console.log('scrollHeight',elem.scrollHeight)
        //console.log('scrollHeight',elem.scrollHeight)

        //console.log('-----------------------------')
        if(( elem.target.offsetHeight + elem.target.scrollTop ) >=  elem.target.scrollHeight-800) {
          //console.log(elem.offsetHeight)
          //console.log(elem.scrollTop)
          //console.log(elem.scrollHeight)
          //console.log('entro',elem.offsetHeight + elem.scrollTop, elem.scrollHeight)
          //if( this.nextOffset !== false ) this.setData();
        }
      }
    */
  ngOnInit(): void {
    this.fabricanteSource$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.fabricanteSelected);
    }).pipe(
      switchMap(( query: string ) => {
        if(query) {
          return this.apiServ.get('/fabricantes',{searchItem: query, limit: 100},{spinner: 'false'})
            .pipe(
              map((ret:FabricanteResponse) => ret && ret.rows || [])
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
          return this.apiServ.get('/marcas',{searchItem: query, fabricante: this.fabricanteSelectedOption?._id, limit: 100},{spinner: 'false'})
            .pipe(
              map((ret:MarcaResponse) => ret && ret.rows || [])
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
          return this.apiServ.get('/articulos',{ searchItem: query, fabricante: this.fabricanteSelectedOption?._id, marca: this.marcaSelectedOption?._id, limit: 100 },{spinner: 'false'})
            .pipe(
              map((ret:ArticuloResponse) => ret && ret.rows || [])
            )
        }
        return of([]);
      })
    );
    /*
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
    */
    console.log(this.router.routerState.snapshot.url)
    this.router.routerState.snapshot.url
    .split('/').map((value, idx, array)=> {
      if(value === 'proveedores') {
        this.proveedorId = array[idx+1]
      }
    });
    this.apiServ.get(`/proveedor/${this.proveedorId}/productos`,{
      limit: 500
    })
    .subscribe((retData:any) => {
      console.log(retData);
      this.provData = retData.rows;
      this.provDataSort();
      console.log(this.provData);
    });
  }

  provDataSort(){
    if(this.provData)
    this.provData.sort((a, b) => {
      let fa = a.fullname.toLowerCase(),
          fb = b.fullname.toLowerCase();
      if (fa < fb) {
          return -1;
      }
      if (fa > fb) {
          return 1;
      }
      return 0;
    });
  }

  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }

  readNewData() {
    if(
      this.fabricanteSelectedOption ||
      this.marcaSelectedOption ||
      this.articuloSelectedOption
      ){
        this.apiServ.get('/productoname',
        {
          fabricante: this.fabricanteSelectedOption?._id,
          marca: this.marcaSelectedOption?._id,
          articulo: this.articuloSelectedOption?._id,
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
      } else {
        this.newData = [];
      }
  }

  changeFabricanteLoading(e: boolean): void {
    this.fabricanteLoading = e;
    if(this.fabricanteSelectedOption){
      this.fabricanteSelectedOption = null;
      this.readNewData();
    }
    //console.log('changeFabricanteLoading',this.fabricanteLoading);
  }

  onFabricanteSelect(event: TypeaheadMatch): void {
    this.fabricanteSelectedOption = event.item;
    this.readNewData();
    console.log(this.fabricanteSelectedOption);
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
  }

  onMarcaSelect(event: TypeaheadMatch): void {
    this.marcaSelectedOption = event.item;
    console.log('onMarcaSelect',this.marcaSelectedOption);
    this.readNewData();

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
    console.log(this.articuloSelectedOption);
  }

  onArticuloPreview(event: TypeaheadMatch): void {
    if (event) {
      this.articuloPreviewOption = event.item;
    } else {
      this.articuloPreviewOption = null;
    }
    console.log(this.articuloPreviewOption);
  }
  //
  //changeProdNameLoading(e: boolean): void {
  //  this.prodNameLoading = e;
  //  if(this.prodNameSelectedOption){
  //    this.prodNameSelectedOption = null;
  //    this.readNewData();
  //  }
  //  console.log('changeProdNameLoading',this.prodNameLoading);
  //}
  //
  //onProdNameSelect(event: TypeaheadMatch): void {
  //  this.prodNameSelectedOption = event.item;
  //  console.log(this.prodNameSelectedOption);
  //}
  //
  //onProdNamePreview(event: TypeaheadMatch): void {
  //  if (event) {
  //    this.prodNamePreviewOption = event.item;
  //  } else {
  //    this.prodNamePreviewOption = null;
  //  }
  //  console.log(this.prodNamePreviewOption);
  //}
  //
  addToProv(reg:any){
    console.log(reg);
    const newProve:ProveedorProductoFd = {
      proveedor: this.proveedorId,
      articulo: reg.articulo,
      presentacion: reg._id,
    }
    this.apiServ.post('/proveedor/producto',newProve, {spinner: 'false'}).subscribe( ret => {
      console.log(ret)
      const retitem:any = ret;1
      retitem.value['fullname']= reg.fullname;
      if(!this.provData) this.provData = [];
      this.provData.push(retitem.value);
      const el = document.getElementById(reg._id)?.parentElement?.parentElement;
      if(el){
        el.remove();
      }
      const idx = this.newData.findIndex(item => item._id === reg._id );
      if(idx > -1) this.newData.splice ( idx, 1);
      if(this.newData.length === 0) {
        this.fabricanteSelected = '';
        this.marcaSelected = '';
        this.articuloSelected = '';
      }
      if(this.dynamic === this.max ){
        const moreData:any[] = <any>document.getElementsByName("toadd");
        if(moreData.length === 0 && this.filtro.length > 0) this.filtro = '';
        this.allNewValue = false;
        this.provDataSort();
        setTimeout(() =>{
          this.dynamic = 0;
          this.max = 0;
        }, 2000);
      } else this.dynamic += 1;
    });
  }

  delFromProv(item:provProduct){
    this.apiServ.delete(`/proveedor/producto/${item._id}`, {spinner: 'false'}).subscribe(ret => {
      const borrado:any = ret;
      const idx = this.provData.findIndex( reg => borrado._id === reg._id);
      if(idx > -1) this.provData.splice ( idx, 1);
      const el = document.getElementById(borrado._id)?.parentElement?.parentElement;
      if(el){
        el.remove();
      }
      if(this.dynamic === this.max ){
        this.allProvValue = false;
        setTimeout(() =>{
          this.dynamic = 0;
          this.max = 0;
        }, 2000);
      } else this.dynamic += 1;
    });
  }

  removeIsExists(){
    if(this.provData)
    this.provData.map(provItem => {
      const idx = this.newData.findIndex( reg => provItem.presentacion._id === reg._id);
      if(idx > -1){
        this.newData.splice( idx, 1);
      }
    })
  }

  addSelected(){
    const array:prodName[] = this.getSelected(this.newData);
    this.max = array.length;
    this.dynamic = 1;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      this.addToProv(element);
    }
  }

  removeSelected(){
    const array = this.getSelected(this.provData);
    this.max = array.length;
    this.dynamic = 1;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      this.delFromProv(element);
    }
  }

  getSelected(array:any[]):any[] {
    return array.filter( item => item.isSelected === true );
  }

  toggleAll(sourceData:any[], setValue:boolean){
    let array:any[] = <any>document.getElementsByName("toadd");
    //if(element.checked){
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        const idx = sourceData.findIndex( reg => element.id === reg._id);
        if(idx > -1) sourceData[idx].isSelected = setValue;
      }
    //}
    //sourceData.map( item => item.isSelected = setValue);
  }
  unsetDefaultCheck(){
    this.allNewValue = false;
    this.allProvValue = false;
  }
}
