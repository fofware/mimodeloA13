import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

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

    //console.log(this.msg);

    let num = this.msg.id.fromMe ? this.msg._data.from : this.msg._data.to.user;
    this.audio = this.domsanitize.bypassSecurityTrustUrl(`${environment.WAP_MEDIA}/${this.msg.id._serialized}`);
  }
}
