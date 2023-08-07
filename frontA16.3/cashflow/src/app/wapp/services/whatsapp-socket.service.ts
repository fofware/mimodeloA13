import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class WhatsappSocketService extends Socket {
  constructor() {
    super( {
      url: environment.SKT2.URL,
      options: {
        query: {
          token: localStorage.getItem('token'),
        },
        autoConnect: false,
      }
    });
    super.on('connect', () => {
      console.warn('Connect');
      this.ioSocket.onAny(async (eventName:string, ...args:any) => {
        const d = new Date().getTime()/1000;
        console.warn('Debug,evento',eventName, args);
        for (let i = 0; i < args.length; i++) {
          const e = args[i];
          if(e?.phone && e?.msg){
            console.log(i,e.phone,e.msg?.from,e.msg?.author);
            console.log(i,e.msg.body,e.msg._data.notifyName)
          }
        }
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

  async send(eventName:string, data:any){
    //console.log(eventName,'emit',data);
    const queviene = await super.emit(eventName,data);
    console.log('send-rpta',queviene);
  }

  override disconnect(_close?: any) {
    const disc = super.disconnect({logout: 'pepe'});
    console.log('discconet', disc);
  }
}
