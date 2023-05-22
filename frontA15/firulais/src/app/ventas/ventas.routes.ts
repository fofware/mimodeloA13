import { Route } from "@angular/router";
export const VENTAS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./ventas.component').then(mod => mod.VentasComponent),
    children: [
      {
        path: 'menu',
        data: {
          id: 'ventas'
        },
        loadComponent: () => import('../app-menu/app-menu.component').then(mod => mod.AppMenuComponent),
      },
      { path: '', redirectTo: 'menu', pathMatch: 'full' }
    ]
  }
]
