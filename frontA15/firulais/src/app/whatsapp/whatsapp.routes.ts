import { Routes } from '@angular/router';
import { WhatsappComponent } from './whatsapp.component';

export const WHATS_APP_ROUTE: Routes = [
  {path: '',
    component: WhatsappComponent,
    children: [
      {path: 'dashboard', loadComponent: () => import('./whats-app-dashboard/whats-app-dashboard.component').then( mod => mod.WhatsAppDashboardComponent)},
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },
]
