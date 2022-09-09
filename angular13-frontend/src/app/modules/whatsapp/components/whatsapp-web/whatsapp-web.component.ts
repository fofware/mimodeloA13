import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  constructor(private wappSrv: WappService) { }

  ngOnInit(): void {
    this.wappSrv.getChats().subscribe((chats:any) => {
      this.chats = chats;
      console.warn(this.chats)
    });
    this.wappSrv.getContacts().subscribe(contacts => {
      this.contacts = contacts;
      console.warn(this.contacts)
    });
  }

}
