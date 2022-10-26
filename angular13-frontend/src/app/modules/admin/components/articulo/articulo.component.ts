import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ArticuloFormComponent } from '../articulo-form/articulo-form.component';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit {
  data:any[] = [];
  loading = false;
  offset: number | boolean = 0;
  nextOffset: number | boolean = 0;
  count = 0;
  limit = 50;
  searchItem = '';

  constructor( 
    private apiSrv: ApiService,
    private modalService: NgbModal,
    ) { }

  @ViewChild('searchInput', { static: true }) articulosSearchInput!: ElementRef;
    //@ViewChild('myTabla', { static: true }) myTableRef!: ElementRef;

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
        if( this.nextOffset !== false ) this.setData();
      }
    }

  ngOnInit(): void {
    fromEvent(this.articulosSearchInput.nativeElement, 'keyup')
    .pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 3 || res.length === 0)
      // Time in milliseconds between key events
      , debounceTime(700)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    )
    .subscribe((text: string) => {
      this.searchData();
    })
    this.searchData();
  }

  setData(){
    if(this.loading) return;
    if(this.nextOffset === false) return;
    this.loading = true;
    const params = {
      limit: this.limit,
      offset: this.nextOffset,
      sort: 'fullname',
      searchItem: this.searchItem
    };
    this.apiSrv.post('/articulos/public',params).subscribe((data:any) => {
      console.log(data);
      this.count = data.count;
      this.offset = data.offset;
      this.nextOffset = data.nextOffset;
      this.data = this.data.concat(data.rows);
      console.log(this.data.length);
      console.log(data.apiTime);
      this.loading = false;
    });
  }

  searchData(){
    this.nextOffset = 0;
    this.count = 0;
    this.data = [];
    this.setData();
  }

  async edit(ev:any){
    //console.log("Add New Articulo");
    //console.log(this.newArticulo);
    //this.selectedArticulo = Object.assign({},this.newArticulo);
    //this.selectedArticulo._id = `${new ObjectID()}`; //await this.idServive.generate();
    ////const newArticulo = this.modalService.open(ArticuloFormAddModalComponent);
    //console.log("Selected",this.selectedArticulo);
    const modalRef = this.modalService.open(ArticuloFormComponent, {
      ariaLabelledBy: 'modal-basic-title'
      , fullscreen: true
      //, size: 'xl'
      , beforeDismiss: () => {
        console.log("BeforeDisMiss");
        const ret: boolean = modalRef.componentInstance.checkData();
        return ret;
      }
      //, windowClass: 'xlModal'
      , scrollable: true
      , centered: false
      , backdrop: false
    });
    /*
    * parametros para la modal creo
    * modalRef.componentInstance.newReg = true;
    * modalRef.componentInstance.user = this.user
    * modalRef.componentInstance.selectedArticulo = this.selectedArticulo;
    * modalRef.componentInstance.previusArticulo = this.previusArticulo;
    */
    modalRef.componentInstance.articulo = ev;
    modalRef.result.then( (result:any) => {
      if (result) {
        console.log(result);
        if (result === 'Save'){
          //this.previusArticulo = Object.assign({},modalRef.componentInstance.selectedArticulo);
          //this.articuloList.push(modalRef.componentInstance.selectedArticulo);
        }
      }
    });
  }

}
