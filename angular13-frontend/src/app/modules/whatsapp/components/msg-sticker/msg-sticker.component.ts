import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-msg-sticker',
  templateUrl: './msg-sticker.component.html',
  styleUrls: ['./msg-sticker.component.css']
})
export class MsgStickerComponent implements OnInit {
  @Input() msg:any;
  @Input() name:any;
  @Input() picUrl:any;
  sticker:any;

  constructor(private domsanitizer: DomSanitizer) { }

  ngOnInit(): void {
    //console.log(this.msg);
    //this.sticker = `data:${this.msg.mediaData.mimetype};base64,${this.msg.mediaData.data}`;
    let num = '';
    if(this.msg.id.fromMe){
      console.log(this.msg.id.fromMe)
    } else {
      num = this.msg._data.to.user
    }
    this.sticker = `${environment.WAP_MEDIA}/${this.msg.id._serialized}`;
  }
}
