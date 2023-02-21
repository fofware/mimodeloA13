import { Route } from "@angular/router";
export const ABMDATA_ROUTES: Route[] = [
  {
    path: 'fabricante',
    data: {
      title: 'Fabricantes',
      path: 'fabricante',
      coleccion: 'fabricante',
      placeholder: 'Fabricante',
    },
    loadComponent: () => import('./abmdata.component').then(mod => mod.AbmdataComponent),
  },
  {
    path: 'marca',
    data: {
      title: 'Marcas',
      path: 'marca',
      coleccion: 'marca',
      placeholder: 'Marca',
    },
    loadComponent: () => import('./abmdata.component').then(mod => mod.AbmdataComponent),
  },
  {
    path: 'modelo',
    data: {
      title: 'Modelos',
      path: 'modelo',
      coleccion: 'modelo',
      placeholder: 'Modelo',
    },
    loadComponent: () => import('./abmdata.component').then(mod => mod.AbmdataComponent),
  },
  {
    path: 'especie',
    data: {
      title: 'Especies',
      path: 'especie',
      coleccion: 'especie',
      placeholder: 'Especie',
    },
    loadComponent: () => import('./abmdata.component').then(mod => mod.AbmdataComponent),
  },
  {
    path: 'talla',
    data: {
      title: 'Tallas',
      path: 'talla',
      coleccion: 'talla',
      placeholder: 'Talla',
    },
    loadComponent: () => import('./abmdata.component').then(mod => mod.AbmdataComponent),
  },
  {
    path: 'edad',
    data: {
      title: 'Edades',
      path: 'edad',
      coleccion: 'edad',
      placeholder: 'Edad',
    },
    loadComponent: () => import('./abmdata.component').then(mod => mod.AbmdataComponent),
  },
  {
    path: 'rubro',
    data: {
      title: 'Rubros',
      path: 'rubro',
      coleccion: 'rubro',
      placeholder: 'Rubro',
    },
    loadComponent: () => import('./abmdata.component').then(mod => mod.AbmdataComponent),
  },
  {
    path: 'linea',
    data: {
      title: 'Lineas',
      path: 'linea',
      coleccion: 'linea',
      placeholder: 'Lineas',
    },
    loadComponent: () => import('./abmdata.component').then(mod => mod.AbmdataComponent),
  },
  {
    path: 'edit',
    loadComponent: () => import('./abmdatar-form/abmdatar-form.component').then(mod => mod.AbmdatarFormComponent),
  },
];
