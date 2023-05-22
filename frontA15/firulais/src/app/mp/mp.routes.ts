import { Routes } from '@angular/router';

export const MP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./mp.component').then(mod => mod.MpComponent),
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('./mp-inicio/mp-inicio.component')
          .then( mod => mod.MpInicioComponent)
      },
      {
        path: 'credenciales',
        loadComponent: () =>
          import('./mp-credenciales/mp-credenciales.component')
          .then( mod => mod.MpCredencialesComponent)
      },
      //{path: 'dashboard', loadComponent: () => import('./whats-app-dashboard/whats-app-dashboard.component').then( mod => mod.WhatsAppDashboardComponent)},
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },
]
