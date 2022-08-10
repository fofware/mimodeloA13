import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageComponent } from 'src/app/components/no-page/no-page.component';
import { AdminComponent } from './admin.component';
import { ArticuloComponent } from './components/articulo/articulo.component';
import { FabricanteComponent } from './components/fabricante/fabricante.component';
import { HomeComponent } from './components/home/home.component';
import { MarcaComponent } from './components/marca/marca.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      //
      // https://www.tektutorialshub.com/angular/angular-pass-data-to-route/
      // https://www.tektutorialshub.com/angular/angular-passing-parameters-to-route/
      // https://www.tektutorialshub.com/angular/angular-child-routes-nested-routes/
      //
      {
        path: '',
        component: HomeComponent
      },
      {
        path: ':id',
        component: HomeComponent
      },
      {
        path: 'archivos/fabricantes',
        component: FabricanteComponent
      },
      {
        path: 'archivos/marcas',
        component: MarcaComponent
      },
      {
        path: 'archivos/articulos',
        component: ArticuloComponent
      },
      {
        path: '**',
        component: NoPageComponent
      }
    ]
  },
  /*
  {
    path: '', redirectTo: 'list',
    //pathMatch: 'full'
  },
  */
  {
    path: '**',
    component: NoPageComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
