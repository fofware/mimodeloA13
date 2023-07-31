import { Routes } from '@angular/router'
import { NoPageComponent } from '../components/no-page/no-page.component';

export const SYSTEM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./system.component').then(mod => mod.SystemComponent),
    children: [
      {
        path: 'algo',
        loadComponent: () =>
          import('../../app/components/p-menu/p-menu.component')
          .then( mod => mod.PMenuComponent)
      },
      {
        path: 'menues',
        loadComponent: () =>
          import('../system/components/menues/menues.component')
          .then( mod => mod.MenuesComponent)
      },
      
      {
        path: '',
        redirectTo: 'algo',
        pathMatch: 'full',
      },
      
      {
        path: '**',
        component: NoPageComponent,
      },

    ]
  },
]
