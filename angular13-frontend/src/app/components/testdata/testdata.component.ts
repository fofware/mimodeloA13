import { Component, OnInit } from '@angular/core';
import { map, pipe, retry } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Socket1Service } from 'src/app/services/socket.service';

@Component({
  selector: 'app-testdata',
  templateUrl: './testdata.component.html',
  styleUrls: ['./testdata.component.css']
})
export class TestdataComponent implements OnInit {
  datos:any[] = [];
  constructor(
    private api: ApiService,
    private socket: Socket1Service
  ) { }

  ngOnInit(): void {
    this.socket.emit('client:productoPrecio',{})
    this.socket.get('server:productoPrecio', (data:any):void =>{
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        this.datos.push(element)
      }
    })
    //this.socket.get('server:mp:ipn', (data:any):void =>{
    //  console.log(data);
    //})
    //this.socket.get('server:mp:webhooks', (data:any):void =>{
    //  console.log(data);
    //})
  }

}
