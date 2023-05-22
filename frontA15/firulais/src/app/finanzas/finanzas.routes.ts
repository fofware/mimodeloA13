import { Route } from "@angular/router";
export const FINANZAS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./finanzas.component').then(mod => mod.FinanzasComponent),
    children: [
      {
        path: 'menu',
        data: {
          id: 'finanzas'
        },
        loadComponent: () => import('./components/informe/informe.component').then(mod => mod.InformeComponent),
      },
      {
        path: 'cuentas',
        data: {
        },
        loadComponent: () => import('./components/cuentas/cuentas.component').then(mod => mod.CuentasComponent),
      },
      {
        path: 'categorias',
        data: {
        },
        loadComponent: () => import('./components/categorias/categorias.component').then(mod => mod.CategoriasComponent),
      },
      {
        path: 'informes',
        data: {
        },
        loadComponent: () => import('./components/informe/informe.component').then(mod => mod.InformeComponent),
      },

      { path: '', redirectTo: 'menu', pathMatch: 'full' }
    ]
  }
]
