import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { authUser, decodeToken } from 'src/app/services/auth.service';
import { Socket2Service } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';

const ORI_API = environment.WAP_API
export interface phone {
  user?: string;
  phone?: string;
  activo?: boolean;
  rooms?: string[];
  email?: string;
  state?: string;
}
@Injectable({
  providedIn: 'root'
})
export class WappService {
  data = this.socket.fromEvent<any>('qr');
  picUrl = this.socket.fromEvent<any>('picUrl');
  ready = this.socket.fromEvent<any>('ready');
  state = this.socket.fromEvent('change_state');
  currentMessage = this.socket.fromEvent<any>("message");
  createMessage = this.socket.fromEvent<any>("message_create");

  waChat = this.socket.fromEvent<any>('wa:Chat');

  private phoneList = new BehaviorSubject<phone[]>([]);
  private phoneSelected = new BehaviorSubject<phone>({});
  private phoneState = new BehaviorSubject<any>({});

  constructor(private socket: Socket2Service,private http: HttpClient) {
    const token = localStorage.getItem('token');
    const user:authUser = decodeToken(token);
    if (user._id)
      this.getPhones(user._id).subscribe( (data:any) => {
        if(data.length){
          data.map( async (p:phone) => {
            if(p.phone) p.state = await this.getPhoneState(p.phone);
            this.phoneState.next(p.state)
          });
          this.phoneList.next(data);
          this.phoneSelected.next(data[0]);
        }
      })
  }
  public get phoneSelectedValue(): phone {
    return this.phoneSelected.value;
  }
  public get phoneListValue(): phone[] {
    return this.phoneList.value;
  }
  public get phonesList(): Observable<phone[]> {
    return this.phoneList.asObservable();
  }
  public get phone(): Observable<phone> {
    return this.phoneSelected.asObservable();
  }
  public get phoneStatus(): Observable<phone> {
    return this.phoneState.asObservable();
  }
  public get phoneStatusValue(): Observable<phone> {
    return this.phoneState.value();
  }
  getPhones(clientId:string) {
    return this.http.get<string[]>(`${ORI_API}/phones/${clientId}`);
  }
  getPhoneState(num:string): Promise<string>{
    return new Promise((resolve, reject) => {
      this.http.get<string>(`${ORI_API}/${num}/state/`).subscribe( data => {
        console.log('getPhoneState',data)
        resolve(data)
      })
    });
   }

  getChats(num:string){
    //const num = '5493624683656'
    return this.http.get(`${ORI_API}/${num}/chats`);
  }
  getContacts(num:string){
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
  async desconecta(){
    const emite = await this.socket.emit('disconect');
    return emite;
  }
  estado(){
    return this.socket.fromEvent('change_state').pipe(map((data:any) => data.msg));
  }
  mensaje(){
    return this.socket.fromEvent('mensaje').pipe(map((data:any) => data.msg));
  }
  leer(eventName:string, callback:Function ){
    this.socket.on(eventName, callback);
  }
}
