import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

const ORI_API = environment.API_URL

@Component({
  selector: 'app-msg-image',
  templateUrl: './msg-image.component.html',
  styleUrls: ['./msg-image.component.css']
})
export class MsgImageComponent implements OnInit {
  @Input() msg:any;
  @Input() name:any;
  @Input() picUrl:any;
  width = 0;
  height = 0;
  image:any;
  constructor( private domsanitize: DomSanitizer) { }

  ngOnInit(): void {
    //console.log(this.msg)
    let coef = this.msg._data.height / this.msg._data.width;
    if (coef >= 1){
      this.height = this.msg._data.height * (240/this.msg._data.width);
      this.width = 240;
    } else {
      this.height = this.msg._data.height * (346/this.msg._data.width);
      this.width = 346;
    }
    //if(this.msg.mediaData?.mimetype)
    //  this.image = `data:${this.msg.mediaData.mimetype};base64,${this.msg.mediaData.data}`;
    //else {
      let num = '';
      if(this.msg.id.fromMe){
        console.log(this.msg.id.fromMe)
      } else {
        num = this.msg._data.to.user
      }

      this.image = this.domsanitize.bypassSecurityTrustUrl(`${environment.WAP_MEDIA}/${this.msg.id._serialized}`);
    //}
  }
}
