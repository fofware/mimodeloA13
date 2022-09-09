import { Component, OnInit } from '@angular/core';
import { WappService } from '../../services/wapp.service';

@Component({
  selector: 'app-whatsapp-contactos',
  templateUrl: './whatsapp-contactos.component.html',
  styleUrls: ['./whatsapp-contactos.component.css']
})
export class WhatsappContactosComponent implements OnInit {
  contactsList:any;
  searchItem = ""

  constructor(private wappSrv: WappService ) { }

  ngOnInit(): void {
    this.wappSrv.getContacts().subscribe(data => {
      this.contactsList = data;
      console.log(this.contactsList)
    })
  }

}
