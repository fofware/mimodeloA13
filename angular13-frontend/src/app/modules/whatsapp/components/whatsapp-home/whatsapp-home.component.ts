import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { WappService } from '../../services/wapp.service';

@Component({
  selector: 'app-whatsapp-home',
  templateUrl: './whatsapp-home.component.html',
  styleUrls: ['./whatsapp-home.component.css']
})
export class WhatsappHomeComponent implements OnInit, OnDestroy {
  public unArray:any[] = [];
  private destroy$ = new Subject<any>();
  phoneSelected:any = {} ;
  phoneList:any = []
  msgs:any[] = [];
  user:any;
  private _ready!: Subscription;
  private _status!: Subscription;
  private _docSub!: Subscription;

  private _createMessage!: Subscription;
  private _currentMessage!: Subscription;

  constructor(private wappSrv: WappService, private authSrv: AuthService) {}

  qrstr = "1";
  isqr = true;
  qrMaxRetries = 0;
  qrSend = 0;

  async ngOnInit(): Promise<void> {
    this.user = this.authSrv.userValue;
    //const pepe = await this.wappSrv.getPhones(this.user);
    this.wappSrv.phone
        .pipe( takeUntil(this.destroy$) )
        .subscribe( res => {
        this.phoneSelected = res;
        //this.user = this.authService.userValue;
    });

    this.wappSrv.phonesList
        .pipe( takeUntil(this.destroy$) )
        .subscribe( res => {
        this.phoneList = res;
        //this.user = this.authService.userValue;
    });

    //console.log(this.phoneList,this.phoneSelected, this.user)
    this._docSub = this.wappSrv.data
        .pipe(takeUntil(this.destroy$))
        .subscribe(
        data => {
          this.isqr = (data.qrSend > data.qrMaxRetries && data.qrMaxRetries > 0);
          this.qrstr = data.qr;
//        this.numero = data.numero;
          this.qrMaxRetries = data.qrMaxRetries;
          this.qrSend = data.qrSend;
//        this.picUrl = data.picUrl;
      });
    this._status = this.wappSrv.state
        .pipe( takeUntil(this.destroy$) )
        .subscribe((res:any) => {
        //console.log('_status',res)
          this.phoneList.map( (p:any) => {
          if(p.phone === res.phone) p.state = res.state;
        })
    })

    this._ready = this.wappSrv.ready
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          async _ready => {
            this.isqr = true;
            await this.wappSrv.getPhones(this.user._id);

            this.phoneSelected = this.wappSrv.phoneValue;
            this.phoneList = this.wappSrv.phoneListValue;
        });

  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
  //ngOnInit(): void {
  //  //this.wappSrv.phone
  //  //.pipe( takeUntil(this.destroy$) )
  //  //.subscribe( res => {
  //  //  this.selectedPhone = res;
  //  //});
  //  //this._currentMessage = this.wappSrv.currentMessage.subscribe(
  //  //  data => {
  //  //    this.msgs.push(data);
  //  //});
  //  //this._createMessage = this.wappSrv.createMessage.subscribe(
  //  //  data => {
  //  //    this.msgs.push(data);
  //  //});
  //}
  registrar(){
    this.wappSrv.waRegister();
  }
  reconnect(){
    this.wappSrv.waConnect(this.phoneSelected);
  }
}
