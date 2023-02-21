import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

export const ADMIN_ROUTE: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'menu',
        loadComponent: () => import('../app-menu/app-menu.component').then( mod => mod.AppMenuComponent)
      },
      {
        path: 'maestro',
        loadChildren: () => import('../maestro/maestro.routes').then( mod => mod.MAESTRO_ROUTES)
      },
      {
        path: 'mp',
        loadChildren: () => import('../mp/mp.routes').then( mod => mod.MP_ROUTE)
      },
      {path: '', redirectTo: 'menu', pathMatch: 'full'}
    ]
  },
]
