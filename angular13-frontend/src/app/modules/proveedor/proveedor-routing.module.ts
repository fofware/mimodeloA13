import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageComponent } from 'src/app/components/no-page/no-page.component';
import { ArticulosComponent } from './components/articulos/articulos.component';
import { FormComponent } from './components/form/form.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/list/list.component';
import { ListapreciosComponent } from './components/listaprecios/listaprecios.component';
import { MarcaComponent } from './components/marca/marca.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ProveedorComponent } from './proveedor.component';

const routes: Routes = [
  {
    path: '',
    component: ProveedorComponent,
    children: [
      //
      // https://www.tektutorialshub.com/angular/angular-pass-data-to-route/
      // https://www.tektutorialshub.com/angular/angular-passing-parameters-to-route/
      // https://www.tektutorialshub.com/angular/angular-child-routes-nested-routes/
      //
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: ':id',
        component: HomeComponent,
        children: [
          {
            path: '',
            component: FormComponent
          },
          //{
          //  path: 'marcas',
          //  component: MarcaComponent,
          //},
          //{
          //  path: 'articulos',
          //  component: ArticulosComponent
          //},
          {
            path: 'productos',
            component: ProductosComponent
          },
          {
            path: 'precios',
            component: ListapreciosComponent
          },
          {
            path: '**',
            component: NoPageComponent
          }
        ]
      },
      {
        path: '', redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '**',
        component: NoPageComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedorRoutingModule { }
