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
    /*
    window.setInterval(function() {
      const elem = document.getElementById('msjs');
      if(elem){
        console.log(elem.scrollHeight);
        elem.scrollTop = elem.scrollHeight;
      }
    }, 5000);
    */
  }

  ngOnChanges(e:any){
    console.log(e);
    this.messages = e.chat.currentValue.messages;
    this.picUrl = e.chat.currentValue.picUrl;
    this.name = e.chat.currentValue.name;
  }
}
