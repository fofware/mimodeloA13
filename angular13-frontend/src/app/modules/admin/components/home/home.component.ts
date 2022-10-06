import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  menuId = '';
  /*
  menudata = [
    {
      id: 'menu',
      data: {
        title: 'Administración',
        comment: '',
        icon: 'fas fa-home fa-4x',
        menu: [
          {
            title: 'Perfil',
            icon: 'far fa-user fa-3x',
            permiso: 'owner',
            target: '',
            rel: 'noopener',
            route: '/private/profile',
            param: ''
          },
          {
            title: 'Configuración',
            icon: 'fas fa-cogs fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            route: 'config',
            param: ''
          },
          {
            title: 'Archivos',
            icon: 'fas fa-folder fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            route: 'archivos',
            param: ''
          },
          {
            title: 'Compras',
            icon: 'fas fa-file-invoice-dollar fa-3x',
            permiso: 'moderator',
            target: '_blank',
            rel: 'noopener',
            href: 'https://angular.io/tutorial'
          },
          {
            title: 'Ventas',
            icon: 'fas fa-cash-register fa-3x',
            permiso: 'moderator',
            target: '_blank',
            rel: 'noopener',
            href: 'https://angular.io/tutorial'
          },
          {
            title: 'Reportes',
            icon: 'fas fa-chart-line fa-3x',
            permiso: 'moderator',
            target: '_blank',
            rel: 'noopener',
            href: 'https://angular.io/tutorial'
          }
         ]
      }
    },
    {
      id: 'config',
      data: {
        title: 'Configuraciones',
        icon: 'fas fa-cogs fa-4x',
        comment: 'Puesta a punto el sistema',
        menu: [
          {
            title: 'Menues',
            icon: 'fas fa-folder fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            route: 'menues',
            param: ''
          },
          {
            title: 'Archivos',
            icon: 'fas fa-folder fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            route: '/private/menu',
            param: 'archivos1'
          },
          {
            title: 'Leer csv',
            icon: 'fas fa-cogs fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            href: '/cargalistas',
            param: ''
          },
  
        ]
      }
    },
    {
      id: 'default',
      data: {
        title: 'asdasdf',
        comment: 'asdfasdfa',
        menu: [
          {
            title: 'Datos personales',
            icon: 'fas fa-database fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            route: '/pesonas/',
            param: ''
          },
  
        ]
      }
    },
    {
      id: 'archivos',
      data:
      {
        title: 'Archivos',
        icon: 'fas fa-folder-open fa-4x',
        comment: 'Archivos del Sistema',
        menu: [
          {
            title: 'Usuarios',
            icon: 'fas fa-users fa-3x',
            permiso: 'owner',
            target: '',
            rel: 'noopener',
            route: '/private/users',
            param: ''
          },
          {
            title: 'Libreta Direcciones',
            icon: 'far fa-address-book fa-3x', // 'fas fa-user-alt fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            route: '/personas',
            param: ''
          },
          {
            title: 'Articulos',
            icon: 'fas fa-barcode fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            route: '/articuloslist',
            param: ''
          },
          {
            title: 'Productos',
            icon: 'fas fa-barcode fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            route: '/productlist',
            param: ''
          },
          {
            title: 'Productos Edit',
            icon: 'fas fa-barcode fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            route: '/productoedit',
            param: ''
          },
          {
            title: 'Compras',
            icon: 'fas fa-file-invoice-dollar fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            href: 'https://angular.io/tutorial',
            param: ''
          },
          {
            title: 'Ventas',
            icon: 'fas fa-cash-register fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            href: 'https://angular.io/tutorial',
            param: ''
          },
          {
            title: 'Reportes',
            icon: 'fas fa-chart-line fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            href: 'https://angular.io/tutorial',
            param: ''
          }
        ]
      }
    },
    {
      id: 'archivos1',
      data:
      {
        title: 'Archivos',
        comment: 'Manejo de Archivos',
        icon: 'fas fa-folder-open fa-4x',
        menu: [
          {
            title: 'Importar Base de Datos',
            icon: 'fas fa-cloud-download-alt fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            href: '/apitoapi',
            param: ''
          },
          {
            title: 'Importar Archivos',
            icon: 'fas fa-folder fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            href: '/importdata',
            param: ''
          },
          {
            title: 'Importar Listas',
            icon: 'fas fa-cogs fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            route: '/cargalistas',
            param: ''
          },
          {
            title: 'Aparear Productos',
            icon: 'fas fa-link fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            route: '/productoslink',
            param: ''
          },
          {
            title: 'Personas',
            icon: 'fas fa-user-alt fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            href: 'https://angular.io/tutorial',
          },
          {
            title: 'Compras',
            icon: 'fas fa-file-invoice-dollar fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            href: 'https://angular.io/tutorial',
            param: ''
          },
          {
            title: 'Ventas',
            icon: 'fas fa-cash-register fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            href: 'https://angular.io/tutorial',
            param: ''
          },
          {
            title: 'Reportes',
            icon: 'fas fa-chart-line fa-3x',
            permiso: 'moderator',
            target: '',
            rel: 'noopener',
            href: 'https://angular.io/tutorial',
            param: ''
          }
        ]
      }
    }
  ];
  */
  data: any = {};
  title = '';
  comment = '';
  menu: any[] = [];
  breadcrumb:any = [];

  constructor(
    public actRoute: ActivatedRoute,
    public route: Router,
    private menuService: MenuService
  ) {
    this.menuId = this.actRoute.snapshot.params['id'] || 'admin';

    this.findMenu();

  }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe(params => {
      console.log( 'params', params);
      //this.menuId = 'menu';//params['id'];
      //this.findMenu();
    });
  }

  findMenu(): void{
    const menuData = this.menuService.get( this.menuId) ;
    this.data = menuData;
    console.log("Menu Data",this.data);
  }


}
