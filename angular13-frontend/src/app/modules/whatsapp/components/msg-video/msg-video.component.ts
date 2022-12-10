import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

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
  height = 0;
  width = 0;

  constructor(private domsanitize: DomSanitizer) { }

  ngOnInit(): void {
    //console.log("video",this.msg)
    let coef = this.msg._data.height / this.msg._data.width;
    if (coef >= 1){
      this.height = this.msg._data.height * (240/this.msg._data.width);
      this.width = 240;
    } else {
      this.width = 346;
      this.height = this.msg._data.height * (346/this.msg._data.width);
    }
    console.log(this.width, this.height)
    //if(this.msg?._data?.mimetype) {
    //  this.video = this.domsanitize.bypassSecurityTrustUrl(`data:${this.msg.mediaData?.mimetype};base64,${this.msg.mediaData?.data}`);
    //} else {
      let num = this.msg.id.fromMe ? this.msg._data.from : this.msg._data.to.user;
      this.video = this.domsanitize.bypassSecurityTrustUrl(`${environment.WAP_MEDIA}/${this.msg.id._serialized}`);
    //}
  }
}
