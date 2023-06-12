import { Routes } from '@angular/router';
import { NoPageComponent } from './components/no-page/no-page.component';

const getContact = (param:number): string => {
  const data = [
    'SYSTEM_ADMIN',
    'CLIENT_ADMIN',
    'CLIENT_EDITOR'
  ]
  return data[param];
}

export const appRoutes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((mod) => mod.HomeComponent),
  },
  {
    path: 'toast',
    //canMatch: [() => inject(AuthService).isLogged],
    loadComponent: () => import('./test/ngbd-toast-global/ngbd-toast-global.component')
                        .then(mod => mod.NgbdToastGlobal)
  },

  {
    path: 'user',
    //canMatch: [() => inject(AuthService).isLogged],
    loadChildren: () => import('./users/users.routes')
                        .then(mod => mod.USERS_ROUTES)
  },

  /*
  {
    path: 'coso',
    loadComponent: () => import('./common/header/header.component').then(mod => mod.HeaderComponent),
    resolve: {
      contact: async () => getContact(0),
      numero: () => 3
    },
  },
  */
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NoPageComponent,
  },
];
  /*
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
  {path: 'maestro',
    canMatch: [() => inject(AuthService).isLogged],
    loadChildren: () => import('./maestro/maestro.routes')
                        .then(mod => mod.MAESTRO_ROUTES)
  },
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
  */
  /*
  {
    path: 'compras',
    canMatch: [() => inject(AuthService).isLogged],
    loadChildren: () => import('./compras/compras.routes')
                        .then(mod => mod.COMPRAS_ROUTES)
  },
  */
