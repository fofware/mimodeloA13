/**
 * probar esto para hacer un router dinámico
 * https://stackoverflow.com/questions/61478069/adding-dynamic-routes-in-angular
 */
import { inject } from '@angular/core';
import { Routes } from '@angular/router'
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha'
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { NoPageComponent } from './components/no-page/no-page.component'

export const appRoutes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component')
      .then(mod => mod.HomeComponent)
  },
  /*
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/sign-in/sign-in.component')
      .then(mod => mod.SignInComponent)
  },
  */
  {
    path: 'signup',
    providers:[
      {
        provide: RECAPTCHA_V3_SITE_KEY,
        useValue: environment.recaptcha.siteKey
      },
    ],
    loadComponent: () =>
      import('./auth/sign-up/sign-up.component')
      .then(mod => mod.SignUpComponent)
  },
  {
    path: 'registrarse',
    loadComponent: () =>
      import('./auth/sign-up/sign-up.component')
      .then(mod => mod.SignUpComponent)},
  {
    path: 'articulos',
    loadComponent: () =>
      import('./components/articulo-list/articulo-list.component')
      .then(mod => mod.ArticuloListComponent)
  },
  {
    path: 'whatsapp',
    canMatch: [() => inject(AuthService).isLogged],
    loadChildren: () => import('./whatsapp/whatsapp.routes')
                        .then(mod => mod.WHATS_APP_ROUTE)
  },
  /*
  {path: 'maestro',
    canMatch: [() => inject(AuthService).isLogged],
    loadChildren: () => import('./maestro/maestro.routes')
                        .then(mod => mod.MAESTRO_ROUTES)
  },
  */
  {path: 'mp',
    canMatch: [() => inject(AuthService).isLogged],
    loadChildren: () => import('./mp/mp.routes')
                        .then(mod => mod.MP_ROUTES)
  },
  {
    path: 'admin',
    canMatch: [() => inject(AuthService).isLogged],
    loadChildren: () => import('./admin/admin.routes')
                        .then(mod => mod.ADMIN_ROUTE)
  },
  /*
  {
    path: 'compras',
    canMatch: [() => inject(AuthService).isLogged],
    loadChildren: () => import('./compras/compras.routes')
                        .then(mod => mod.COMPRAS_ROUTES)
  },
  */
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: '**',
    component: NoPageComponent
  }
]
