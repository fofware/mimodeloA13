import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HtmldataComponent } from './components/htmldata/htmldata.component';
import { NoPageComponent } from './components/no-page/no-page.component';
import { PrivateHomeComponent } from './components/private-home/private-home.component';
import { TestdataComponent } from './components/testdata/testdata.component';
import { AuthGuard } from './guards/auth.guard';
import { IsLoggedGuard } from './guards/is-logged.guard';
import { AuthService } from './services/auth.service';

export function readUser(): any {
  const token = localStorage.getItem('token');
  if (token && token !== null ) {
    const jwtToken = JSON.parse(decodeURIComponent(atob(token.split('.')[1]).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
    const d = new Date().getTime();
    if (jwtToken.exp <= d){
      return jwtToken;
    }
    localStorage.removeItem('token');
  }
  return {
    nickname: 'Anónimo',
    image: '/assets/images/defuser.png',
    roles: ['VISITANTE'],
    iat: 0,
    exp: 0
  };
}
const myUser = readUser();
console.log(myUser);
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home'
  , component: HomeComponent
  },
  {
    path: 'socketdata'
  , component: TestdataComponent
  },
  {
    path: 'htmldata'
  , component: HtmldataComponent
  },
  {
    path: 'temp',
    loadChildren: () => import(`./modules/temp/temp.module`)
      .then(
        module => module.TempModule
      ) 
  },
  {
    path: 'users',
    loadChildren: () => import(`./modules/user/user.module`)
      .then(
        module => module.UserModule
      ) 
  },
  {
    path: 'proveedores',
    loadChildren: () => import(`./modules/proveedor/proveedor.module`)
      .then(
        module => module.ProveedorModule
      ),
    canActivate: [IsLoggedGuard,AuthGuard],
    data: {
      roles: ['sys_admin'],
    }

  },
  {
    path: 'private/menu',
    component: PrivateHomeComponent,
    canActivate: [IsLoggedGuard]
  },
  {
    path: 'private/menu/:id'
    , component: PrivateHomeComponent,
    canActivate: [IsLoggedGuard,AuthGuard],
    data: {
      roles: ['sys_admin','sys_user','client_admin','client_user','proveedor_admin','proveedor_client','revendedor_admin','revendedor_user']
    }
  },

  { path: '**', component: NoPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
