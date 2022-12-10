import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { retry, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class Socket1Service extends Socket {
  constructor(private authService: AuthService) {
    super( { 
      url: environment.SKT1.URL, 
      options: environment.SKT1.OPTIONS 
    } );
    const options = authService.getToken();
    if(options){
      super.on('connect', () => {
        console.log(this);
      })
    }
  };

  get(eventName:string, callback:Function ){
    super.on(eventName, callback);
  }
  async send(eventName:string, data:any){
    //console.log(eventName,'emit',data);
    await super.emit(eventName,data);
  }
}

export class Socket2Service extends Socket {
  constructor() {
    super( { 
      url: environment.SKT2.URL, 
      options: { 
        query: {
          token: localStorage.getItem('token'),
        }
      } 
    } );

    super.on('connect', () => {
      console.warn('Connect');
      this.ioSocket.onAny(async (eventName:string, ...args:any) => {
        if(
          eventName !== 'message' &&
          eventName !== 'message_create' &&
          eventName !== 'change_state'
        ){
          console.log('Debug,evento',eventName)
          console.log('datos', args)
        }
     })
    })
  }

  get(eventName:string, callback:Function ){
    super.on(eventName, callback);
  }

  async send(eventName:string, data:any){
    //console.log(eventName,'emit',data);
    const queviene = await super.emit(eventName,data);
    console.log('send-rpta',queviene);
  }
}
