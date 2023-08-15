import { Routes } from '@angular/router';

export const ALQUILERES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./alquileres.component').then(mod => mod.AlquileresComponent),
    children: [
      {
        path: 'inmuebles',
        loadComponent: () =>
          import('./inmuebles/inmuebles.component')
          .then( mod => mod.InmueblesComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component')
          .then( mod => mod.DashboardComponent)
      },
      //{path: 'dashboard', loadComponent: () => import('./whats-app-dashboard/whats-app-dashboard.component').then( mod => mod.WhatsAppDashboardComponent)},
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
]
