import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-whatsapp-msgs',
  templateUrl: './whatsapp-msgs.component.html',
  styleUrls: ['./whatsapp-msgs.component.css']
})
export class WhatsappMsgsComponent implements OnInit, OnChanges {
  @Input() chat = {};
  messages:any;
  picUrl:any;
  name: any;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(e:any){
    console.log(e);
    this.messages = e.chat.currentValue.messages;
    this.picUrl = e.chat.currentValue.picUrl;
    this.name = e.chat.currentValue.name;
  }
}
