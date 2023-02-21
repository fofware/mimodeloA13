import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-listas-precios-nav',
  templateUrl: './listas-precios-nav.component.html',
  styleUrls: ['./listas-precios-nav.component.css']
})
export class ListasPreciosNavComponent implements OnInit, OnChanges {

  @Input() proveedor:any = null;
  @Input() title = 'Listas';
  @Output() productosCountEvent = new EventEmitter<number>();
  fchList = [];
  provProdList:any[] = [];
  constructor(
    private apiServ : ApiService
  ) { }

  ngOnInit(): void {
    //console.log('LP proveedor', this.proveedor)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('LP Changes', changes);
    if(changes['proveedor']){
      if(changes['proveedor']['currentValue']){
        this.loadProveedorData(changes['proveedor']['currentValue'])
      } else {
        this.fchList = [];
        this.provProdList = [];
      }
    }
    //if(changes['title']) 
  }

  loadProveedorData( params: any ){
    console.log('LP loadProveedor data for ', params );
    this.apiServ.get(`/proveedor/${params._id}/productos`,{
      limit: 500
    })
    .subscribe((retData:any) => {
      this.provProdList = this.provDataSort(retData.rows);
      this.productosCountEvent.emit(retData.count) ;
    });

  }
  provDataSort(data:any) :any {
    if(data)
      return data.sort((a:any, b:any) => {
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
  generar(){
    for (let index = 0; index < this.provProdList.length; index++) {
      const e = this.provProdList[index];
      console.log(e);
    }
  }
}
