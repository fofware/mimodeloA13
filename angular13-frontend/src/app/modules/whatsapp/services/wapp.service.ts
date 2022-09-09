import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket2Service } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';

const ORI_API = environment.WAP_API

@Injectable({
  providedIn: 'root'
})
export class WappService {
  data = this.socket.fromEvent<any>('qr');
  picUrl = this.socket.fromEvent<any>('picUrl');
  ready = this.socket.fromEvent<any>('ready');
  currentMessage = this.socket.fromEvent<any>("message");
  waChat = this.socket.fromEvent<any>('wa:Chat')
  
  constructor(private socket: Socket2Service,private http: HttpClient) { }
  
  getChats(){
    const num = '5493624683656'
    return this.http.get(`${ORI_API}/${num}/chats`);

  }
  getContacts(){
    const num = '5493624683656'
    return this.http.get(`${ORI_API}/${num}/contacts`);
  }
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
    const emite = await this.socket.emit('registranumero', token);
    console.log(emite);
  }
  async waGetChats(){
    const emite = await this.socket.emit('getChats');
    console.warn("waGetChates",emite)
  }
  desconecta(){
    this.socket.disconnect()
  }
}
