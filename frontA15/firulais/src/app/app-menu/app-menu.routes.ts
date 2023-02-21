import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AppMenuComponent } from './app-menu.component';

export const APP_MENU_ROUTE: Routes = [
  {
    path: '',
    component: AppMenuComponent,
    children: [
      { path: 'maestro', loadChildren: () => import('../maestro/maestro.routes').then( mod => mod.MAESTRO_ROUTES)},
    //  {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },
]
