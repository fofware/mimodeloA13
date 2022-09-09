import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WappService } from '../../services/wapp.service';

@Component({
  selector: 'app-wappconnect',
  templateUrl: './wappconnect.component.html',
  styleUrls: ['./wappconnect.component.css']
})
export class WappconnectComponent implements OnInit {

  qrstr = "1";
  numero = '';
  picUrl = ''
  qrMaxRetries = 0;
  qrSend = 0;
  isqr = true;
  private _docSub!: Subscription;
  private _picUrlSub!: Subscription;
  private _ready!: Subscription;

  constructor(private documentService: WappService, private router: Router) {}

  ngOnInit(): void {
    this._docSub = this.documentService.data.subscribe(
      data => {
        this.isqr = (data.qrSend > data.qrMaxRetries && data.qrMaxRetries > 0);
        this.qrstr = data.qr;
        this.numero = data.numero;
        this.qrMaxRetries = data.qrMaxRetries;
        this.qrSend = data.qrSend;
        this.picUrl = data.picUrl;
    });
    this._ready = this.documentService.ready.subscribe(
      _ready => {
        this.isqr = true;
        this.router.navigate(['wa','web'])
      }
    );
    /*
    this._picUrlSub = this.documentService.picUrl.subscribe(
      picUrl => {
        this.picUrl = picUrl;
    });
    */
  }
  checkNumber(){
    if(this.numero.length === 13)
      //this.documentService.getPicUrl(this.numero);
    console.log(this.numero)
  }
  registrar(){
    this.documentService.waRegister(this.numero);
  }

}
