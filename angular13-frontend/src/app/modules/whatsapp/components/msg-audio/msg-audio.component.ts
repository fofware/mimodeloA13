import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-msg-audio',
  templateUrl: './msg-audio.component.html',
  styleUrls: ['./msg-audio.component.css']
})
export class MsgAudioComponent implements OnInit {
  @Input() msg:any;
  @Input() name:any;
  @Input() picUrl:any;
  audio: any;
  constructor(private domsanitize: DomSanitizer) { }

  ngOnInit(): void {
    console.log(this.msg);
    if(this.msg?.mediaData?.mimetype)
      this.audio = this.domsanitize.bypassSecurityTrustUrl(`data:${this.msg.mediaData.mimetype};base64,${this.msg.mediaData.data}`);

  }

}
