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
  numero = '';
  picUrl = ''
  isqr = true;
  private _docSub!: Subscription;
  private _picUrlSub!: Subscription;


  constructor(private documentService: WappService) {}

  ngOnInit(): void {

    this._docSub = this.documentService.data.subscribe(
      data => {
        this.isqr = false;
        this.qrstr = data.qr;
        this.numero = data.numero;
    //    this.picUrl = data.picUrl;
    });
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
