import { Injectable } from '@angular/core';

export const menudata = [
  {
    id: 'finanzas',
    data: {
      title: 'Finanzas',
      comment: '',
      icon: 'fas fa-home fa-4x',
      menu: [
        {
          title: 'Categorías',
          icon: 'fas fa-cogs fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'categorias'
        },
        {
          title: 'Cuentas',
          icon: 'fas fa-cogs fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'cuentas',
          param: ''
        },
        {
          title: 'Cajas',
          icon: 'fas fa-folder fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'maestro'
        },
      ]
    }
  },
  {
    id: 'admin',
    data: {
      title: 'Administración',
      comment: '',
      icon: 'fas fa-home fa-4x',
      menu: [
        //{
        //  title: 'Perfil',
        //  icon: 'far fa-user fa-3x',
        //  permiso: 'owner',
        //  target: '',
        //  rel: 'noopener',
        //  route: 'profile',
        //  param: ''
        //},
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
          title: 'Maestro de Artículos',
          icon: 'fas fa-folder fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'maestro'
        },
        {
          title: 'Compras',
          icon: 'fas fa-file-invoice-dollar fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'compras'
        },
        {
          title: 'Ventas',
          icon: 'fas fa-cash-register fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'ventas'
        },
        {
          title: 'Finanzas',
          icon: 'fas fa-chart-line fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'finanzas'
        },
        {
          title: 'Reportes',
          icon: 'fas fa-chart-line fa-3x',
          permiso: 'moderator',
          target: '_blank',
          rel: 'noopener',
          href: 'https://angular.io/tutorial'
        },
        {
          title: 'Mercado Pago',
          icon: 'fa-solid fa-sack-dollar fa-3x',
          permiso: 'moderator',
          target: '_self',
          rel: 'noopener',
          route: '../',
          param: 'mp'
        }
      ]
    }
  },
  {
    id: 'maestro',
    data: {
      title: 'Maestro',
      icon: 'fas fa-cogs fa-4x',
      comment: 'Archivos Base',
      menu: [
        {
          title: 'Fabricantes',
          icon: 'fas fa-folder fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'fabricante'
        },
        {
          title: 'Marcas',
          icon: 'fas fa-cogs fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'marca'
        },
        {
          title: 'Modelos',
          icon: 'fas fa-cogs fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'modelo'
        },
        {
          title: 'Especies',
          icon: 'fas fa-cogs fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'especie'
        },
        {
          title: 'Edades',
          icon: 'fas fa-cogs fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'edad'
        },
        {
          title: 'Tallas',
          icon: 'fas fa-cogs fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'talla'
        },
        {
          title: 'Unidades',
          icon: 'fas fa-cogs fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'unidad'
        },
        {
          title: 'Rubros',
          icon: 'fas fa-cogs fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'rubro'
        },
        {
          title: 'Lineas',
          icon: 'fas fa-cogs fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'linea'
        },
        {
          title: 'Articulos',
          icon: 'fas fa-cogs fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '../',
          param: 'articulos'
        },

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
      title: 'Maestro de Artículos',
      icon: 'fas fa-folder-open fa-4x',
      comment: 'Definición de Artículos en General',
      menu: [
        {
          title: 'Fabricantes',
          icon: 'fas fa-barcode fa-3x',
          permiso: 'moderator',
          target: '',
          rel: '',
          route: 'fabricantes',
          param: ''
        },
        {
          title: 'Marcas',
          icon: 'fas fa-barcode fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'marcas',
          param: ''
        },
        {
          title: 'Rubros',
          icon: 'fas fa-barcode fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'rubros',
          param: ''
        },
        {
          title: 'Líneas',
          icon: 'fas fa-barcode fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'lineas',
          param: ''
        },
        {
          title: 'Especie',
          icon: 'fas fa-barcode fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'especies',
          param: ''
        },
        {
          title: 'Medidas',
          icon: 'fas fa-barcode fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'medidas',
          param: ''
        },
        {
          title: 'Edades',
          icon: 'fas fa-barcode fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'edades',
          param: ''
        },
        {
          title: 'Articulos',
          icon: 'fas fa-barcode fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'articulos',
          param: ''
        },
        {
          title: 'Presentaciones',
          icon: 'fas fa-barcode fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'presentaciones',
          param: ''
        },
        /*
        {
          title: 'Manufacturado',
          icon: 'fas fa-barcode fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'manufacturado',
          param: ''
        },
        {
          title: 'Usuarios',
          icon: 'fas fa-users fa-3x',
          permiso: 'owner',
          target: '',
          rel: 'noopener',
          route: '/users',
          param: ''
        },
        {
          title: 'Libreta Direcciones',
          icon: 'far fa-address-book fa-3x', // 'fas fa-user-alt fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '/proveedores',
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
        */
      ]
    }
  },
  {
    id: 'compras',
    data:
    {
      title: 'Compras',
      icon: 'fas fa-folder-open fa-4x',
      comment: 'Archivos del Sistema de Compras',
      menu: [
        {
          title: 'Proveedores',
          icon: 'far fa-address-book fa-3x', // 'fas fa-user-alt fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'proveedores',
          param: ''
        },
        {
          title: 'Listas de Precios',
          icon: 'fas fa-barcode fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: 'listaprecios',
          param: ''
        },
      ]
    }
  },
  {
    id: 'ventas',
    data:
    {
      title: 'Ventas',
      icon: 'fas fa-folder-open fa-4x',
      comment: 'Sistema de Ventas',
      menu: [
        {
          title: 'Clientes',
          icon: 'far fa-address-book fa-3x', // 'fas fa-user-alt fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '/proveedores',
          param: ''
        },
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
/*
        {
          title: 'Copia de Api a Api',
          icon: 'fas fa-database fa-3x',
          permiso: 'moderator',
          target: '',
          rel: 'noopener',
          route: '/apitoapi',
          param: ''
        },
*/
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

@Injectable({
  providedIn: 'root'
})

export class AppMenuService {

  get( id: any): any {
    for (let i = 0; i < menudata.length; i++) {
      const m = menudata[i];
      if ( m.id == id ){
        return m.data;
      }
    }
    return {data: { title: id, icon: '', comment: 'Comuniquese con el Administrador del sistema, esta opcion no existe' }};
  }
}
