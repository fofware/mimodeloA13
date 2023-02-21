import { Routes } from '@angular/router';
import { ArticulosEditComponent } from './articulos-edit.component';

export const ARTICULOS_EDIT_ROUTE: Routes = [
  {path: '',
    component: ArticulosEditComponent,
    children: [
      {
        path: 'data',
        loadComponent: () => import('./articulo-edit-data/articulo-edit-data.component').then( mod => mod.ArticuloEditDataComponent)
      },
      {
        path: 'data/:_id',
        loadComponent: () => import('./articulo-edit-data/articulo-edit-data.component').then( mod => mod.ArticuloEditDataComponent)
      },
      //{path: 'name', loadComponent: () => import('./articulo-edit-name/articulo-edit-name.component').then( mod => mod.ArticuloEditNameComponent)},
      //{path: 'name/:_id', loadComponent: () => import('./articulo-edit-name/articulo-edit-name.component').then( mod => mod.ArticuloEditNameComponent)},
      {path: 'presentaciones', loadComponent: () => import('./articulo-edit-presentaciones/articulo-edit-presentaciones.component').then(mod => mod.ArticuloEditPresentacionesComponent)},
      {path: 'presentaciones/:_id', loadComponent: () => import('./articulo-edit-name/articulo-edit-name.component').then( mod => mod.ArticuloEditNameComponent)},
      {path: 'detalles', loadComponent: () => import('./articulo-edit-name/articulo-edit-name.component').then( mod => mod.ArticuloEditNameComponent)},
      {
        path: 'formula',
        loadComponent: () => import('./articulo-edit-extradata/articulo-edit-extradata.component').then(mod => mod.ArticuloEditExtradataComponent),
        data: {
          process: 'formula'
        },
      },
      {
        path: 'beneficios',
        loadComponent: () => import('./articulo-edit-extradata/articulo-edit-extradata.component').then(mod => mod.ArticuloEditExtradataComponent),
        data: {
          process: 'beneficio'
        },
      },
      {path: '', redirectTo: 'data', pathMatch: 'full'}
    ]
  },
]
