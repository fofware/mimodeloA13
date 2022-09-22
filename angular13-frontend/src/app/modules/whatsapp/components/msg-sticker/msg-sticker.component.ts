import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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
    console.log(this.msg);
    this.sticker = `data:${this.msg.mediaData.mimetype};base64,${this.msg.mediaData.data}`;

  }

}
