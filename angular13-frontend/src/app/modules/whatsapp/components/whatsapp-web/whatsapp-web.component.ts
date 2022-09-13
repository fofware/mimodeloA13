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
  contacts:any;
  phoneSelected = "";
  private destroy$ = new Subject<any>();

  constructor(private wappSrv: WappService) { }

  ngOnInit(): void {
    this.wappSrv.phone
    .pipe( takeUntil(this.destroy$) )
    .subscribe( res => {
      if(res.phone)
        this.wappSrv.getChats(res.phone).subscribe(data => {
          this.chats = data;
          console.log(this.chats)
        })
    });
  }
}
