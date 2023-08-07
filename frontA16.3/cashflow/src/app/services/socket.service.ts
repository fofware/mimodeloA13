import { Injectable, inject} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class dataSocketService extends Socket {
  constructor() {
    super( {
      url: environment.SKT1.URL,
      options: {
        query: {
          token: localStorage.getItem('token'),
        },
        autoConnect: false,
      }
    });

    super.on('connect', () => {
      console.warn('Connect');
      this.ioSocket.onAny( (eventName:string, ...args:any) => {
        const d = new Date().getTime()/1000;
        console.warn('Debug,evento', eventName, args);
      })
    });
  }

  override connect() {
    const conn = super.connect();
    console.log('connect', conn);
  }

  get(eventName:string, callback:Function ){
    super.on(eventName, callback);
  }

  async send(eventName:string, data?:any){
    //console.log(eventName,'emit',data);
    const queviene = await super.emit(eventName,data);
    console.log('send-rpta',queviene);
  }

  override disconnect(_close?: any) {
    const disc = super.disconnect({logout: 'pepe'});
    console.log('discconet', disc);
  }
}
/*
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket = inject(dataSocketService)

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }
  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data) => data.msg));
  }
}
*/
