import { Routes } from '@angular/router'
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha'
import { environment } from 'src/environments/environment';

export const USERS_ROUTES: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component')
      .then(mod => mod.HomeComponent)
  },
  {
    path: 'signup',
    providers:[
      {
        provide: RECAPTCHA_V3_SITE_KEY,
        useValue: environment.recaptcha.siteKey
      },
    ],
    loadComponent: () =>
      import('./components/sign-up/sign-up.component')
      .then(mod => mod.SignUpComponent)
  },
]