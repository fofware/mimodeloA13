import { Component, Input, OnInit } from '@angular/core';

export interface INewData {
  tipo: string;
  name: string;
  showname: boolean;
  value: string;
  showvalue: boolean
}

@Component({
  selector: 'app-articulo-form-extradata-edit',
  templateUrl: './articulo-form-extradata-edit.component.html',
  styleUrls: ['./articulo-form-extradata-edit.component.css']
})

export class ArticuloFormExtradataEditComponent implements OnInit {
  
  @Input() dato:string = '';
  @Input() extradata:any[] = [];
  
  newData:INewData = {tipo: this.dato, name: '', showname: false, value: '', showvalue: false};

  constructor() { }
  
  ngOnInit(): void {
  }
  addData(){
    this.extradata.push(JSON.parse(JSON.stringify(this.newData)));
    this.newData = {tipo: this.dato, name: '', showname: false, value: '', showvalue: false}
    console.log('addData');
  }
  borraData(idx:number){
    console.log('borraData');
  }
}
