import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-msg-document',
  templateUrl: './msg-document.component.html',
  styleUrls: ['./msg-document.component.css']
})
export class MsgDocumentComponent implements OnInit {
  @Input() msg:any;
  @Input() name:any;
  @Input() picUrl:any;
  document:any;

  constructor(domsanitize: DomSanitizer) { }

  ngOnInit(): void {
    //console.log(document);
  }

}
