import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-msg-image',
  templateUrl: './msg-image.component.html',
  styleUrls: ['./msg-image.component.css']
})
export class MsgImageComponent implements OnInit {
  @Input() msg:any;
  @Input() name:any;
  @Input() picUrl:any;
  image:any;
  constructor() { }

  ngOnInit(): void {
    console.log(this.msg)
    this.image = `data:${this.msg.mediaData.mimetype};base64,${this.msg.mediaData.data}`;
    
  }

}
