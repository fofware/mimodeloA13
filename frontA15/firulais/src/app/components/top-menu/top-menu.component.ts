import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iTopMenu } from 'src/app/services/top-menu.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthBtnComponent } from 'src/app/auth/auth-btn/auth-btn.component';
import { WappBtnComponent } from 'src/app/whatsapp/wapp-btn/wapp-btn.component';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    AuthBtnComponent,
    WappBtnComponent
  ],
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent {
  public isMenuCollapsed = true;
  public isLogged = false;
  user:any = {};

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
  _authService = inject(AuthService);

  ngOnInit(): void {
    this.user = this._authService.userValue;
    this.setMenu();
  }

  setMenu(){
    console.log('SetMenu in TopMenu');
    this.usrMenu = this.defmenu.filter( item => {
      if (item.roles?.length){
        for (let ir = 0; ir < item.roles.length; ir++) {
          const rol = item.roles[ir];
          if(this._authService.userValue.roles.indexOf(rol) > -1) return true;
        }
        return false;
      } return true;
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
