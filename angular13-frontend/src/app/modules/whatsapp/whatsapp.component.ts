import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { TopMenu } from 'src/app/models/top-menu';
import { AuthService } from 'src/app/services/auth.service';
import { WappService } from './services/wapp.service';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.css']
})
export class WhatsappComponent implements OnInit, OnDestroy {
  public isMenuCollapsed = true;
  public isLogged = false;
  user:any = {};
  phoneSelected:any;
  phoneList:any;
  phoneEstado:any;
  public defmenu:TopMenu[] = [
    //{ title: '<i class="fab fa-whatsapp fa-lg"></i>', link: ['/wa/'] },
    //{ title: 'Marcas', link: ['marca'], roles: ['visitante','client_admin', 'client_user','sys_admin', 'sys_user' ] },
    //{ title: 'Conectar', link: ['connect'], roles: ['client_admin','sys_admin'] },
    { title: 'Contactos', link: ['contactos'], roles: ['client_admin', 'sys_admin'] },
    { title: 'Whatsapp', link: ['web'], roles: [ 'sys_admin'] },
    //{ title: 'Aplicaciones', link: ['admin'], hidden: this.isLogged, roles: ['sys_admin', 'sys_user'] },
    //{ title: 'Aplicaciones', link: ['user'], hidden: this.isLogged, roles: ['client_admin', 'client_user'] },
    //{ title: 'Socket', link: ['socketdata'], roles: ['sys_admin', 'sys_user'] },
    //{ title: 'HttpData', link: ['htmldata'], roles: ['sys_admin', 'sys_user'] },
    //{ title: 'Usuarios', link: ['users'], roles: ['sys_admin', 'sys_user'] },
    //{ title: 'Proveedores', link: ['proveedores'], roles: ['proveedor_admin', 'proveedor_user','sys_admin', 'sys_user'] },
    //{ title: 'Temporal', link: ['temp'], roles: ['sys_admin', 'sys_user']},

  ];

  usrMenu:any =  [] ;
  private _status!: Subscription;
  private destroy$ = new Subject<any>();

  constructor(
    public route: ActivatedRoute,
    private authSrv: AuthService,
    private wappSrv: WappService
  ) {
    this.user = this.authSrv.userValue;
    this.phoneList = this.wappSrv.phoneListValue;
    this.phoneSelected = this.wappSrv.phoneValue;

    this.wappSrv.phonesList
      .pipe(takeUntil(this.destroy$))
      .subscribe((res:any) => {
        //console.log(res);
        this.phoneList = res;
        console.log(this.phoneList)
      })

    this.wappSrv.phone
      .pipe(takeUntil(this.destroy$))
      .subscribe((res:any) => {
        //console.log(res);
        this.phoneSelected = res;
        //console.log(res.state)
        //if(`${res.state}` === "CONNECTED")
      })

    this._status = this.wappSrv.state
      .pipe( takeUntil(this.destroy$) )
      .subscribe((res:any) => {
        console.log('_status',res)
        this.phoneList.map( (p:any) => {
          if(p.phone === res.phone) p.state = res.state;
        })
      })
    //this.phoneEstado = this.wappSrv.phoneStatusValue;
    //this.wappSrv.phoneStatus
    //  .pipe( takeUntil(this.destroy$) )
    //  .subscribe( res => {
    //    console.log("phoneStatus",res);
    //  });
    /*
    this.wappSrv.phone
      .pipe( takeUntil(this.destroy$) )
      .subscribe( res => {
        console.log(res)
        this.selectedPhone = res;
        this.estado = res.state;
        console.log(this.selectedPhone,this.estado, res.state);
      });
    */
    //this.phoneEstado = this.wappSrv.phoneStatusValue

  }

  async ngOnInit(): Promise<void> {
    //const pepe = await this.wappSrv.getPhones(this.user);
    //console.log(pepe);
    this.phoneSelected = this.wappSrv.phoneValue;
    this.phoneList = this.wappSrv.phoneListValue;
    console.log(this.phoneSelected.state, this.phoneSelected)
    //if(`${this.phoneSelected.state}` === 'CONNECTED')
      this.setMenu();
  }

  ngOnDestroy() {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  onChange(event:any){

    this.phoneSelected=event;
    this.wappSrv.phoneValue = event;
  }

  setMenu(){
    this.usrMenu = this.defmenu.filter( item => {
      if (item.roles?.length){
        for (let ir = 0; ir < item.roles.length; ir++) {
          const rol = item.roles[ir];
          if(this.authSrv.userValue.roles.indexOf(rol) > -1) return true;
        }
        return false;
      }
      return true;
    })
    console.log("Menu",this.usrMenu);
  }

  setLoginEvent(value:any){
    this.isLogged = value;
    //this.user = this.authSrv.userValue;
    this.setMenu();
  }

  setUserEvent(value:any){
    //this.user = value;
    //this.setMenu();
  }
}
