import { Routes } from '@angular/router';

export const FINANZAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./finanzas.component').then(mod => mod.FinanzasComponent),
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('./home/home.component')
          .then( mod => mod.HomeComponent)
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
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },
]
