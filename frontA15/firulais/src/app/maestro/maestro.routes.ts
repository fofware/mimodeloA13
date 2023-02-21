import { Route } from "@angular/router";
export const MAESTRO_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./maestro.component').then(mod => mod.MaestroComponent),
    children: [
      {
        path: 'menu',
        data: {
          id: 'maestro'
        },
        loadComponent: () => import('../app-menu/app-menu.component').then(mod => mod.AppMenuComponent),
      },
      {
        path: 'fabricante',
        data: {
          title: 'Fabricantes',
          path: 'fabricante',
          coleccion: 'fabricante',
          getData: 'fabricantes',
          postData: 'fabricante',
          placeholder: 'Fabricante',
        },
        loadComponent: () => import('./abmdata/abmdata.component').then(mod => mod.AbmdataComponent),
      },
      {
        path: 'marca',
        data: {
          title: 'Marcas',
          path: 'marca',
          coleccion: 'marca',
          getData: 'marcas',
          postData: 'marca',
          placeholder: 'Marca',
        },
        loadComponent: () => import('./abmdata/abmdata.component').then(mod => mod.AbmdataComponent),
      },
      {
        path: 'modelo',
        data: {
          title: 'Modelos',
          path: 'modelo',
          coleccion: 'modelo',
          getData: 'modelos',
          postData: 'modelo',
          placeholder: 'Modelo',
        },
        loadComponent: () => import('./abmdata/abmdata.component').then(mod => mod.AbmdataComponent),
      },
      {
        path: 'especie',
        data: {
          title: 'Especies',
          path: 'especie',
          coleccion: 'especie',
          getData: 'especies',
          postData: 'especie',
          placeholder: 'Especie',
        },
        loadComponent: () => import('./abmdata/abmdata.component').then(mod => mod.AbmdataComponent),
      },
      {
        path: 'talla',
        data: {
          title: 'Tallas',
          path: 'talla',
          coleccion: 'talla',
          getData: 'tallas',
          postData: 'talla',
          placeholder: 'Talla',
        },
        loadComponent: () => import('./abmdata/abmdata.component').then(mod => mod.AbmdataComponent),
      },
      {
        path: 'edad',
        data: {
          title: 'Edades',
          path: 'edad',
          coleccion: 'edad',
          getData: 'edades',
          postData: 'edad',
          placeholder: 'Edad',
        },
        loadComponent: () => import('./abmdata/abmdata.component').then(mod => mod.AbmdataComponent),
      },
      {
        path: 'rubro',
        data: {
          title: 'Rubros',
          path: 'rubro',
          coleccion: 'rubro',
          getData: 'rubros',
          postData: 'rubro',
          placeholder: 'Rubro',
        },
        loadComponent: () => import('./abmdata/abmdata.component').then(mod => mod.AbmdataComponent),
      },
      {
        path: 'linea',
        data: {
          title: 'Lineas',
          path: 'linea',
          coleccion: 'linea',
          getData: 'lineas',
          postData: 'linea',
          placeholder: 'Lineas',
        },
        loadComponent: () => import('./abmdata/abmdata.component').then(mod => mod.AbmdataComponent),
      },
      {
        path: 'edit',
        loadComponent: () => import('./abmdata/abmdatar-form/abmdatar-form.component').then(mod => mod.AbmdatarFormComponent),
      },
      {
        path: 'articulos',
        loadChildren: () => import('./articulos/articulos.routes').then(mod => mod.ARTICULOS_ROUTE)
      },
      { path: '', redirectTo: 'menu', pathMatch: 'full' }
    ]
  }
]
