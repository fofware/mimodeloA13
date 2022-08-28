import { Injectable } from '@angular/core';
import { Socket2Service } from 'src/app/services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class WappService {
  data = this.socket.fromEvent<any>('qr');
  picUrl = this.socket.fromEvent<any>('picUrl');

  constructor(private socket: Socket2Service) { }

  async waConnect(param:any) {
    console.log('va a waConnect');
    const token = localStorage.getItem('token')
    const phone = ['5493624683656','5493624380337']
    const emite = await this.socket.emit('id', {token,phone});
    console.log('soket.emit',emite);
  }

  async getPicUrl(param:any) {
    console.log('va a waRegister');
    console.log(this.socket.ioSocket.id)
    const emite = await this.socket.emit('getPicUrl', param);
    console.log(emite);
  }

  async waRegister(numero:any) {
    console.log('va a waRegister');
    const token = localStorage.getItem('token')
    const emite = await this.socket.emit('registranumero', token, numero);
    console.log(emite);
  }
}
