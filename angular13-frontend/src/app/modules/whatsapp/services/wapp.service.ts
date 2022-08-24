import { Injectable } from '@angular/core';
import { Socket2Service } from 'src/app/services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class WappService {
  qr = this.socket.fromEvent<string>('wa:qr');

  constructor(private socket: Socket2Service) { }

  async waConnect(param:any) {
    console.log('va a waConnect');
    console.log(this.socket);
    console.log(this.socket.ioSocket.id)
    const emite = await this.socket.emit('waRegister', param);
    console.log(emite);
  }

  async waRegister(param:any) {
    console.log('va a waRegister');
    console.log(this.socket.ioSocket.id)
    const emite = await this.socket.emit('waRegister', param);
    console.log(emite);
  }
}
