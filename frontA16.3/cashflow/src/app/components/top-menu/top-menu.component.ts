import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapse, NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { UserBtnComponent } from '../user-btn/user-btn.component';
import { AlertBtnComponent } from '../alert-btn/alert-btn.component';
import { WappBtnComponent } from '../wapp-btn/wapp-btn.component';

export interface iTopMenu {
  title: string,
  link: string | string[],
  fragment?: string,
  roles?: string[],
  hidden?: boolean,
  state?:any
}


@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [
    CommonModule,
    NgbNav,
    NgbCollapse,
    NgbNavItem,
    NgbNavLink,
    RouterLink,
    RouterModule,
    UserBtnComponent,
    AlertBtnComponent,
    WappBtnComponent
//    AuthBtnComponent,
//    WappBtnComponent
  ],
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent {
  public isMenuCollapsed = true;
  public isLogged = false;
  user:any = {
  };

  public defmenu:iTopMenu[] = [
    { title: '<i class="fas fa-home-lg"></i>', link: 'home' },
    //{ title: 'Marcas', link: ['marca'], roles: ['visitante','client_admin', 'client_user','sys_admin', 'sys_user' ] },
    { title: 'Articulos', link: ['articulos'], roles: ['visitante','client_admin', 'client_user','sys_admin', 'sys_user'] },
    //{ title: 'Productos', link: ['productos'], roles: ['visitante','client_admin', 'client_user','sys_admin', 'sys_user'] },
    { title: 'Aplicaciones', link: ['admin'], hidden: this.isLogged, roles: ['sys_admin', 'sys_user'] },
    { title: 'Aplicaciones', link: ['user'], hidden: this.isLogged, roles: ['client_admin', 'client_user'] },
    { title: 'WhatsApp', link: ['whatsapp'], hidden: this.isLogged, roles: ['sys_admin', 'sys_user'] },
    { title: 'WhatsApp', link: ['whatsapp'], hidden: this.isLogged, roles: ['client_admin', 'client_user'] },
    //{ title: 'Socket', link: ['socketdata'], roles: ['sys_admin', 'sys_user'] },
    //{ title: 'HttpData', link: ['htmldata'], roles: ['sys_admin', 'sys_user'] },
    //{ title: 'Usuarios', link: ['users'], roles: ['sys_admin', 'sys_user'] },
    //{ title: 'Proveedores', link: ['proveedores'], roles: ['proveedor_admin', 'proveedor_user','sys_admin', 'sys_user'] },
    //{ title: 'Temporal', link: ['temp'], roles: ['sys_admin', 'sys_user']},

  ];

  usrMenu:iTopMenu[] =  [] ;
  _activatedRoute = inject(ActivatedRoute);
//  _authService = inject(AuthService);

  ngOnInit(): void {
//    this.user = this._authService.userValue;
    this.setMenu();
  }

  setMenu(){
    console.log('SetMenu in TopMenu');
    this.usrMenu = this.defmenu.filter( item => {
      if (item.roles?.length){
        for (let ir = 0; ir < item.roles.length; ir++) {
          const rol = item.roles[ir];
//          if(this._authService.userValue.roles.indexOf(rol) > -1) return true;
        }
        return false;
      } return true;
    })
    this.usrMenu = this.defmenu
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
