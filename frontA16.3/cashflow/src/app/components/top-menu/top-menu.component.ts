import { Component, inject, signal, HostListener, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapse, NgbNav, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { UserBtnComponent } from '../../users/components/user-btn/user-btn.component';
import { AlertBtnComponent } from '../alert-btn/alert-btn.component';
import { WappBtnComponent } from '../wapp-btn/wapp-btn.component';
import { UsersService, userIsLogged, userLogged } from 'src/app/users/services/users.service';

export interface iTopMenu {
  title: string,
  link: string | string[],
  fragment?: string,
  roles?: string[],
  hidden?: boolean,
  state?:any
}

const isLogged = userIsLogged;
const user = userLogged;
const myMenu = computed( () => {
  console.log(userIsLogged());
  console.log(userLogged());
  console.log('My Menu in TopMenu');
  const usrMenu = defmenu.filter( item => {
    if (item.roles?.length){
      console.log(item.title,item.roles);
      for (let ir = 0; ir < item.roles?.length; ir++) {
        const rol = item.roles[ir];
        const roles = userLogged().roles;
        console.log(roles,rol, (roles.indexOf(rol) > -1))
        if(roles.indexOf(rol) > -1) return true;
        return false;
      }
    }
    return true;
  })
  return usrMenu;
})

const defmenu:iTopMenu[] = [
  { title: '<i class="fas fa-home-lg"></i>', link: 'home'},
  //{ title: 'Marcas', link: ['marca'], roles: ['visitante','client_admin', 'client_user','sys_admin', 'sys_user' ] },
  { title: 'Articulos', link: ['articulos'] },
  //{ title: 'Productos', link: ['productos'], roles: ['visitante','client_admin', 'client_user','sys_admin', 'sys_user'] },
  { title: 'Aplicaciones Sys', link: ['admin'], roles: ['sys_admin', 'sys_user'] },
  { title: 'Aplicaciones Cli', link: ['user'], roles: ['client_admin', 'client_user'] },
  { title: 'WhatsApp', link: ['whatsapp'], roles: ['sys_admin', 'sys_user'] },
  { title: 'WhatsApp', link: ['whatsapp'], roles: ['client_admin', 'client_user'] },
  //{ title: 'Socket', link: ['socketdata'], roles: ['sys_admin', 'sys_user'] },
  //{ title: 'HttpData', link: ['htmldata'], roles: ['sys_admin', 'sys_user'] },
  //{ title: 'Usuarios', link: ['users'], roles: ['sys_admin', 'sys_user'] },
  //{ title: 'Proveedores', link: ['proveedores'], roles: ['proveedor_admin', 'proveedor_user','sys_admin', 'sys_user'] },
  //{ title: 'Temporal', link: ['temp'], roles: ['sys_admin', 'sys_user']},

];



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
  ],
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  public isMenuCollapsed = true;
  public screenWidth = window.innerWidth;
  public screenHeight = window.innerHeight;

  @HostListener('window:resize', ['$event'])
  onResize(event?:any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }


  usrMenu:iTopMenu[] =  [] ;
  _activatedRoute = inject(ActivatedRoute);
  auth = inject(UsersService);

  ngOnInit(): void {
//    this.user = this._authService.userValue;
    this.onResize();
    this.setMenu();
    this.auth.decodeToken(this.auth.getToken())
  }

  setMenu(){
    console.log('SetMenu in TopMenu');
    this.usrMenu = defmenu.filter( (item:any) => {
      if (item.roles?.length){
        for (let ir:number = 0; ir < item.roles.length; ir++) {
          if (ir) {
            const rol = <never>item.roles[ir];
            const roles:string[] | undefined = user()?.roles;
            if (rol && roles) {
                console.log(roles,rol,roles.indexOf(rol))
                if(roles.indexOf(rol) > -1) return true;
            }
          }
        }
        return false;
      } return true;
    })
    console.log("Menu",this.usrMenu);
  }

  setLoginEvent(value:any){
    userIsLogged.set(value);
    //this.user = this.authSrv.userValue;
    this.setMenu();
  }

  setUserEvent(value:any){
    //this.user = value;
    //this.setMenu();
  }
  get nickname(){
    return myMenu();
  }
}
