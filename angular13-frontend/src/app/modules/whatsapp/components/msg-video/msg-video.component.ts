import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-msg-video',
  templateUrl: './msg-video.component.html',
  styleUrls: ['./msg-video.component.css']
})
export class MsgVideoComponent implements OnInit {
  @Input() msg:any;
  @Input() picUrl:any;
  @Input() name:any;

  video: any;

  constructor(private domsanitize: DomSanitizer) { }

  ngOnInit(): void {
    console.log("video",this.msg)
    if(this.msg?._data?.mimetype)
      this.video = this.domsanitize.bypassSecurityTrustUrl(`data:${this.msg.mediaData?.mimetype};base64,${this.msg.mediaData?.data}`);
  }
}
