import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WappService } from '../../services/wapp.service';

@Component({
  selector: 'app-wappconnect',
  templateUrl: './wappconnect.component.html',
  styleUrls: ['./wappconnect.component.css']
})
export class WappconnectComponent implements OnInit {

  qrstr = "1";
  private _docSub!: Subscription;


  constructor(private documentService: WappService) {}

  ngOnInit(): void {
    this._docSub = this.documentService.qr.subscribe(
      qr => {
      this.qrstr = qr
    });
    this.documentService.waConnect({ cuenta: 'Firulais', number: '5493624380337', name: 'fabian'});
  }

}
