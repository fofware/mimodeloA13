import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { retry, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class Socket1Service extends Socket {
  constructor() {
    super( { url: environment.SKT1.URL, options: environment.SKT1.OPTIONS } );
    super.on('connect', () => {
      console.log(this);
    })
  };
  
  leer(eventName:string, callback:Function ){
    super.on(eventName, callback);
  }
  async send(eventName:string, data:any){
    //console.log(eventName,'emit',data);
    await super.emit(eventName,data);
  }
}

// Se pueden agregar tantos como se necesite 
//@Injectable()
//export class Socket2Service extends Socket {
//  constructor() {
//    super({url: 'http://192.168.100.150:3000', options: {}});
//  };
//  leer(eventName:string, callback:Function ){
//    super.on(eventName, callback);
//  }
//  async send(eventName:string, data:any){
//    //console.log(eventName,'emit',data);
//    await super.emit(eventName,data);
//    
//  }
//}