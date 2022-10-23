import { Component, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { WappService } from '../../services/wapp.service';

@Component({
  selector: 'app-whatsapp-web',
  templateUrl: './whatsapp-web.component.html',
  styleUrls: ['./whatsapp-web.component.css']
})
export class WhatsappWebComponent implements OnInit {
  private _waChat!: Subscription;
  chats:any=[];
  media:any=[];
  contacts:any;
  phoneSelected = {};
  selectedChat = {};
  newMessage = {}

  private destroy$ = new Subject<any>();

  constructor(private wappSrv: WappService) { }

  ngOnInit(): void {
    this.wappSrv.phone
    .pipe( takeUntil(this.destroy$) )
    .subscribe( res => {
      this.phoneSelected = res;
      //console.log(res)
      //this.user = this.authService.userValue;
      if(res.phone){
        console.log(`leyendo los chats de ${res.phone}`)
        this.wappSrv.getChats(res.phone).subscribe( (data:any) => {
          this.chats = data.chats;
          console.log(this.chats)
        })
      }
    })
    this.newMessage = this.wappSrv.currentMessage
        .subscribe(
          data => {
            //console.log(data);
            const phone = data.phone;
            const msg = data.msg;
            //console.log(msg);
            if(msg.from !== 'status@broadcast'){
              const idx = this.chats.findIndex( (c:any) => c.id._serialized === msg.from );
              if(idx > -1){
                this.chats[idx].messages.push(msg);
                this.chats[idx].timestamp = msg.timestamp;
                this.chats[idx].unreadCount += 1;
                this.chats.sort( ( a:any, b:any ) => b.timestamp - a.timestamp);
              } else {
                console.error('message');
                console.error(msg);
              }
            } else {
              console.log('Historia');
              console.warn(msg);
            }
        });
    
    this.newMessage = this.wappSrv.createMessage
        .subscribe(
          data => {
            //console.log(data);
            const msg = data.msg;
            if(msg.fromMe){
              const idx = this.chats.findIndex( (c:any) => c.id._serialized === msg.to );
              if(idx > -1){
                this.chats[idx].messages.push(msg);
                this.chats[idx].timestamp = msg.timestamp;
                this.chats.sort( ( a:any, b:any ) => b.timestamp - a.timestamp);
              } else {
                console.error('create_message')
                console.error('not found msg.to')
                console.error(msg)
              }
            } else {
              console.error('create_message');
              console.error('not fromMe');
              console.error(msg)
            }
        });
    
  }

  setSelectedChat(ev:any,idx:number){
    console.log(ev);
    console.log(idx);
    this.chats.map( ( c:any ) => {
      c.selected = false;
    });
    ev.selected = true;
    this.selectedChat = ev;
  }
}
