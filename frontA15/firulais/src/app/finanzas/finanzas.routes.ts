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
        path: 'categorias',
        data: {
        },
        loadComponent: () => import('./components/categorias/categorias.component').then(mod => mod.CategoriasComponent),
      },

      { path: '', redirectTo: 'menu', pathMatch: 'full' }
    ]
  }
]
