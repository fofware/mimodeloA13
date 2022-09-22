import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-wappchats-list',
  templateUrl: './wappchats-list.component.html',
  styleUrls: ['./wappchats-list.component.css']
})
export class WappchatsListComponent implements OnInit {
  @Input() chat:any;
  @Output() selectedChat = new EventEmitter<any>()
  fch = '';

  constructor() { }

  ngOnInit(): void {
    this.fch = this.calcDate()
  }

  calcDate():string{
    //var dateLocal = new Date(date);
    //var newDate = new Date(dateLocal.getTime() - dateLocal.getTimezoneOffset()*60*1000);
    const dias = [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ]
    let d = new Date((this.chat.timestamp*1000));
    let n = new Date();
    const diff = d.getTimezoneOffset()*60000;
    //d = new Date(d.getTime()-diff);
    //n = new Date(n.getTime()-diff);
    const t = Math.trunc((n.getTime() - d.getTime())/(1000*60*60*24));
    //console.log(t);
    if (t < 1){
      return `${d.getHours()}:${d.getMinutes()}`
    } else if(t < 2){
      return `ayer`
    } else if(t < 7){
      return dias[d.getDay()]
    } else {
      return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
    }

    //- (3600000*3);
  }
  select(chat:any){
    console.log(chat);
    this.selectedChat.emit(chat);
  }
}
