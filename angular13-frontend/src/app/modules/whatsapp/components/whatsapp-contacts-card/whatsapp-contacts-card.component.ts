import { Component, Input, OnInit } from '@angular/core';
import { WappService } from '../../services/wapp.service';

@Component({
  selector: 'app-whatsapp-contacts-card',
  templateUrl: './whatsapp-contacts-card.component.html',
  styleUrls: ['./whatsapp-contacts-card.component.css']
})
export class WhatsappContactsCardComponent implements OnInit {
  @Input() contact:any;

  constructor(private wappSrv: WappService) { }

  ngOnInit(): void {
  }
  cambio(e:any){
    this.wappSrv.saveContact(e.from,e).subscribe(data => console.log(data));
  }
}
