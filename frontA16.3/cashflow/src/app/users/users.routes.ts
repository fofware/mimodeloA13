import { Routes, mapToCanActivate } from '@angular/router'
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha'
import { environment } from 'src/environments/environment';
import { notLoggedGuard } from './guards/not-logged.guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./users.component').then(mod => mod.UsersComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./components/home/home.component')
          .then( mod => mod.HomeComponent)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'signup',
    providers:[
      {
        provide: RECAPTCHA_V3_SITE_KEY,
        useValue: environment.recaptcha.siteKey
      },
    ],
    canActivate: [notLoggedGuard],
    loadComponent: () =>
      import('./components/sign-up/sign-up.component')
      .then(mod => mod.SignUpComponent)
  },

]
