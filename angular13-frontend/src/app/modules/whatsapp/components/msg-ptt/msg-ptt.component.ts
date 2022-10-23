import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-msg-ptt',
  templateUrl: './msg-ptt.component.html',
  styleUrls: ['./msg-ptt.component.css']
})
export class MsgPttComponent implements OnInit {
  @Input() msg:any;
  @Input() picUrl:any;
  @Input() name:any;
  audio: any;
  constructor(private domsanitize:DomSanitizer) { }

  ngOnInit(): void {
    //console.log(this.msg);
    //if(this.msg?.mediaData?.mimetype)
    //this.audio = this.domsanitize.bypassSecurityTrustUrl(`data:${this.msg.mediaData.mimetype};base64,${this.msg.mediaData.data}`);
    this.audio = `http://192.168.100.150:4445/media/${this.msg.id._serialized}`;

  }

}
