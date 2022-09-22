import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WappService } from '../../services/wapp.service';

@Component({
  selector: 'app-whatsapp-contactos',
  templateUrl: './whatsapp-contactos.component.html',
  styleUrls: ['./whatsapp-contactos.component.css']
})
export class WhatsappContactosComponent implements OnInit {
  contactsList:any;
  searchItem = ""
  selectedPhone:any = "";
  //@Input() selectedPhone:string = "";
  constructor(private wappSrv: WappService ) { }
  private destroy$ = new Subject<any>();

  ngOnInit(): void {
    this.wappSrv.phone
    .pipe( takeUntil(this.destroy$) )
    .subscribe( res => {
      this.selectedPhone = res;
      if(res.phone)
        this.wappSrv.getContacts(this.selectedPhone.phone).subscribe(data => {
          this.contactsList = data;
          console.log(this.contactsList)
        })
  });
/*
    this.wappSrv.phone
    .pipe( takeUntil(this.destroy$) )
    .subscribe( res => {
      this.selectedPhone = res.phone;
      if(res.phone)
        this.wappSrv.getContacts(res.phone).subscribe(data => {
          this.contactsList = data;
          console.log(this.contactsList)
        })
    });
  */
  }
  ngOnDestroy(): void{
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
