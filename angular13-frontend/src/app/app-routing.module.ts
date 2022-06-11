import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HtmldataComponent } from './components/htmldata/htmldata.component';
import { NoPageComponent } from './components/no-page/no-page.component';
import { TestdataComponent } from './components/testdata/testdata.component';

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
      ) 
  },
  { path: '**', component: NoPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
