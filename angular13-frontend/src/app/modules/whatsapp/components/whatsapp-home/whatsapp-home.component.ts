import { Component, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { WappService } from '../../services/wapp.service';

@Component({
  selector: 'app-whatsapp-home',
  templateUrl: './whatsapp-home.component.html',
  styleUrls: ['./whatsapp-home.component.css']
})
export class WhatsappHomeComponent implements OnInit {
  public unArray:any[] = [];
  private destroy$ = new Subject<any>();
  selectedPhone:any = "" ;
  msgs:any[] = [];
  private _createMessage!: Subscription;
  private _currentMessage!: Subscription;

  constructor(private wappSrv: WappService) { }
  ngOnInit(): void {
    this.wappSrv.phone
    .pipe( takeUntil(this.destroy$) )
    .subscribe( res => {
      this.selectedPhone = res;
    });
    this._currentMessage = this.wappSrv.currentMessage.subscribe(
      data => {
        this.msgs.push(data);
    });
    this._createMessage = this.wappSrv.createMessage.subscribe(
      data => {
        this.msgs.push(data);
    });
  }

}
