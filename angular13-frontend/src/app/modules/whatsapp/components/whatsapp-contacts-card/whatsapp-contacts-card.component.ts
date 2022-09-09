import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-whatsapp-contacts-card',
  templateUrl: './whatsapp-contacts-card.component.html',
  styleUrls: ['./whatsapp-contacts-card.component.css']
})
export class WhatsappContactsCardComponent implements OnInit {
  @Input() contact:any;

  constructor() { }

  ngOnInit(): void {
  }

}
