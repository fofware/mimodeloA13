import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopMenu } from 'src/app/models/top-menu';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public isMenuCollapsed = true;
  public isLogged = false;
  user:any = {};

  public defmenu:TopMenu[] = [
    { title: '<i class="fas fa-home-lg fa-lg"></i>', link: ['/user/'] },
    //{ title: 'Marcas', link: ['marca'], roles: ['visitante','client_admin', 'client_user','sys_admin', 'sys_user' ] },
    { title: 'Profile', link: ['profile'], roles: ['client_admin','sys_admin'] },
    //{ title: 'Whatsapp', link: ['wa'], roles: ['client_admin', 'sys_admin'] },
    //{ title: 'Aplicaciones', link: ['admin'], hidden: this.isLogged, roles: ['sys_admin', 'sys_user'] },
    //{ title: 'Aplicaciones', link: ['user'], hidden: this.isLogged, roles: ['client_admin', 'client_user'] },
    //{ title: 'Socket', link: ['socketdata'], roles: ['sys_admin', 'sys_user'] },
    //{ title: 'HttpData', link: ['htmldata'], roles: ['sys_admin', 'sys_user'] },
    //{ title: 'Usuarios', link: ['users'], roles: ['sys_admin', 'sys_user'] },
    //{ title: 'Proveedores', link: ['proveedores'], roles: ['proveedor_admin', 'proveedor_user','sys_admin', 'sys_user'] },
    //{ title: 'Temporal', link: ['temp'], roles: ['sys_admin', 'sys_user']},

  ];

  usrMenu:any =  [] ;

  constructor( public route: ActivatedRoute, private authSrv: AuthService ) { }

  ngOnInit(): void {
    this.user = this.authSrv.userValue;
    this.setMenu();
  }

  setMenu(){
    this.usrMenu = this.defmenu.filter( item => {
      if (item.roles?.length){
        for (let ir = 0; ir < item.roles.length; ir++) {
          const rol = item.roles[ir];
          if(this.authSrv.userValue.roles.indexOf(rol) > -1) return true;
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
