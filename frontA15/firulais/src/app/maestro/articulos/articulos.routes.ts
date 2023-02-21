import { Routes } from '@angular/router';
import { ArticulosComponent } from './articulos.component';

export const ARTICULOS_ROUTE: Routes = [
  {path: '',
    component: ArticulosComponent,
    children: [
      {path: 'edit', loadChildren: () => import('./articulos-edit/articulos-edit.routes').then( mod => mod.ARTICULOS_EDIT_ROUTE)},
      {path: 'list', loadComponent: () => import('./articulos-list/articulos-list.component').then(mod => mod.ArticulosListComponent)},
      {path: '', redirectTo: 'list', pathMatch: 'full'}
    ]
  },
]
