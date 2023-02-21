import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageComponent } from 'src/app/components/no-page/no-page.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { IsLoggedGuard } from 'src/app/guards/is-logged.guard';
import { ProveedorComponent } from '../proveedor/proveedor.component';
import { ListasPreciosComponent } from './components/listas-precios/listas-precios.component';
import { ComprasComponent } from './compras.component';

const routes: Routes = [
  {
    path: '',
    component: ComprasComponent,
    children: [
      {
        path: 'proveedores',
        loadChildren: () => import(`../../modules/proveedor/proveedor.module`)
          .then (
            module => module.ProveedorModule
          ),
        canActivate: [IsLoggedGuard,AuthGuard],
        data: {
          roles: ['sys_admin'],
        }
      },
      {
        path: 'listaprecios',
        component: ListasPreciosComponent
      }
    ]
  },
  //{
  //  path: 'proveedores',
  //  loadChildren: () => import(`../../modules/proveedor/proveedor.module`)
  //    .then (
  //      module => module.ProveedorModule
  //    ),
  //  //canActivate: [IsLoggedGuard,AuthGuard],
  //  data: {
  //    roles: ['sys_admin'],
  //  }
  //}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
