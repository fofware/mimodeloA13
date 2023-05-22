import { Route } from "@angular/router";
export const COMPRAS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./compras.component').then(mod => mod.ComprasComponent),
    children: [
      {
        path: 'menu',
        data: {
          id: 'compras'
        },
        loadComponent: () => import('../app-menu/app-menu.component').then(mod => mod.AppMenuComponent),
      },
      { path: '', redirectTo: 'menu', pathMatch: 'full' }
    ]
  }
]
