import { Component, inject, OnInit} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DraggableItemService, SortableModule } from 'ngx-bootstrap/sortable';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-articulo-edit-name',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SortableModule
  ],
  providers:[
    DraggableItemService
  ],
  templateUrl: './articulo-edit-name.component.html',
  styleUrls: ['./articulo-edit-name.component.css']
})
export class ArticuloEditNameComponent implements OnInit {
  _arouter = inject(ActivatedRoute);
  _api = inject(ApiService);
  _location = inject(Location);
  params:any;
  isLoaded = false;
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
  showItems:any[] = [];
  hidenItems:any[] = [];
  data:any;
  async ngOnInit() {
    const arData:any = this._arouter.snapshot.params;
    if(arData?._id){
      this.data = await this._api.getP(`/articulo/maestro/${arData._id}`)
    }
    const locationData = (this._location.getState() as any);
    console.log('locationData',locationData);
    /*
    const snapshotData:any = (this._arouter.snapshot.params)
    console.log('snapshotData',snapshotData);
    if(snapshotData._id){
      this.params = snapshotData;
      this.regData = await this._api.getP(`/articulo/maestro/${snapshotData._id}`)
      this.ready = true
      console.log("Editando",this.regData);
    }
    */
    if(locationData.from){
      this.params = locationData;
      this.data = locationData.listData[locationData.idx];
    }
    console.log('Params',this.params)

    this.setData()
  }
  async setData(){
    this.templateData.map( async src => {
      let itdata = null;
      switch (src) {
        case 'name':
          itdata = { file: 'name', _id: null, name: this.data.name}
          break;
        default:
          if(this.data[src])
            itdata = { file: src, ...this.data[src] }
          break;
      }
      const found = this.data.showName.includes(src);
      if(itdata)
        if(found){
          this.showItems.push(itdata);
        } else {
          this.hidenItems.push(itdata);
        }
      this.isLoaded = true;
    })
  }
  changed(e:any){
    this.data.showName = this.showItems.map( item => item.file);
  }
}
