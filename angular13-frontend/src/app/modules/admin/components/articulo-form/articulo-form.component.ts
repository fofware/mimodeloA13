import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
interface IItemObject {
  id: number;
  file?: string;
  name: string;
}
@Component({
  selector: 'app-articulo-form',
  templateUrl: './articulo-form.component.html',
  styleUrls: ['./articulo-form.component.css']
})
export class ArticuloFormComponent implements OnInit {
  @Input() articulo: any;

  compareArticulo = {};
  prodList:any[] = [];
  unidades:any = [];

  modalsNumber = 0;
  itemObjectsLeft: IItemObject[] = [
    { id: 1, file: 'fabricante', name: 'Alican' },
    { id: 2, file: 'marca', name: 'Agility' },
    { id: 3, file: 'especie', name: 'Gato' }
  ];

  itemObjectsRight: IItemObject[] = [
    { id: 4, file: 'especie', name: 'Tornado' },
    { id: 5, file: 'especie', name: 'Mr. O' },
    { id: 6, file: 'especie', name: 'Tomato' }
  ];

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private apiSrv: ApiService,
    //private list: ListasArtProdService
  ){
    this.modalService.activeInstances.subscribe((list) => {
      this.modalsNumber = list.length;
    });
  }

  ngOnInit(): void {
    console.log(this.articulo);
    this.apiSrv.get(`/extradata/articulo/${this.articulo._id}`).subscribe((data:any) => {
      this.articulo.extradata = data.rows;
      console.log(this.articulo.extradata);
    });
    this.setProdList();
  }

  checkData(): boolean {
    let equal = true;//false; //(JSON.stringify(this.selectedArticulo) === JSON.stringify(this.compareArticulo));
    //console.log("Compara data1", (JSON.stringify(this.selectedArticulo) === JSON.stringify(this.compareArticulo)))
    //console.log(equal);
    if(!equal){
      equal = confirm('Se perderán los cambios si no lo los graba.');
    }
    return equal;
  }

  setProdList(){
    this.compareArticulo = JSON.parse(JSON.stringify(this.articulo));
    this.prodList = JSON.parse(JSON.stringify(this.articulo.presentaciones));
    this.unidades = [{ id: null, name: null }];
    console.log(this.compareArticulo);
    console.warn('ProducList',this.prodList);
    for (let index = 0; index < this.prodList.length; index++) {
      const e:any = this.prodList[index];
      //if(e.count_parte !== 0 && e.count_ins !== 0) // No se muestran los pesables ni las cajas o Packs
      if(e.relacion) // No se muestran los pesables ni las cajas o Packs
      {
        //this.prodList[index].parentname = this.readParent(e.relacion);
        const unid = { id: e.relacion, name: this.readParent(e.relacion) };
        if (!this.unidades) { this.unidades = [unid]; }
        else { this.unidades.push(unid); }
      }
    }
  }

  readParent(id: any, descr?: string): string {
    if ( descr === undefined ) { descr = ''; }
    //const item = this.findProduct(id);
    const item = this.prodList.find(x => x._id === id)
    if (item._id) {
      if (`${item._id}` === `${item.relacion}` || item.relacion === undefined) { item.relacion = null; }
      descr += `${item.name} ${item.contiene} ${item.unidad}`;
      //descr += `${item.unidad}`;
      if (item.relacion !== null) {
        descr = this.readParent(item.relacion, descr);
      }
    }
    return descr.trim();
  }

  /*
  findProduct(id: any): any {
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.prodList.length; index++) {
      const element: any = this.prodList[index];
      if (element._id === id) { return element; }
    }
    return {};
  }
  */
}
