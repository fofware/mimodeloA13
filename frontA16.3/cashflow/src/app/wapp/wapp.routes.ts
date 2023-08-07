import { Routes } from '@angular/router';

export const WAPP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./wapp.component').then(mod => mod.WappComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component')
          .then( mod => mod.DashboardComponent)
      },
      {
        path: 'contactos', loadComponent: () => import('./components/contactos/contactos.component').then( mod => mod.ContactosComponent)},
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
]
