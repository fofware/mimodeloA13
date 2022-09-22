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

  private destroy$ = new Subject<any>();

  constructor(private wappSrv: WappService) { }

  ngOnInit(): void {
    this.wappSrv.phone
    .pipe( takeUntil(this.destroy$) )
    .subscribe( res => {
      this.phoneSelected = res;
      console.log(res)
      //this.user = this.authService.userValue;
      if(res.phone){
        console.log(`leyebdo los chats de ${res.phone}`)
        this.wappSrv.getChats(res.phone).subscribe( (data:any) => {
          this.chats = data.chats;
          this.media = data.mediarslt;
          this.chats.map( (c:any) => {
            c.messages.map( (m:any) => {
              if(m.mediaIdx)
                m.mediaData = this.media[m.mediaIdx]
            })
          })
          console.log(this.media)
          console.log(this.chats)
        })
      }

    })

    /*
    this.wappSrv.phone
    .pipe( takeUntil(this.destroy$) )
    .subscribe( res => {
      if(res.phone)
        this.wappSrv.getChats(res.phone).subscribe(data => {
          this.chats = data;
          console.log(this.chats)
        })
    });
    */
  }

  setSelectedChat(ev:any){
    this.selectedChat = ev;
  }
}
