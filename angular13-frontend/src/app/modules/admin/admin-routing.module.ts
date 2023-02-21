import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageComponent } from 'src/app/components/no-page/no-page.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { IsLoggedGuard } from 'src/app/guards/is-logged.guard';
import { ProveedorComponent } from '../proveedor/proveedor.component';
import { AdminComponent } from './admin.component';
import { ArticuloComponent } from './components/articulo/articulo.component';
import { EdadesComponent } from './components/edades/edades.component';
import { EspecieComponent } from './components/especie/especie.component';
import { FabricanteComponent } from './components/fabricante/fabricante.component';
import { HomeComponent } from './components/home/home.component';
import { LineaComponent } from './components/linea/linea.component';
import { MarcaComponent } from './components/marca/marca.component';
import { MedidasComponent } from './components/medidas/medidas.component';
import { MenuesComponent } from './components/menues/menues.component';
import { PresentacionComponent } from './components/presentacion/presentacion.component';
import { PresentacionesComponent } from './components/presentaciones/presentaciones.component';
import { RubroComponent } from './components/rubro/rubro.component';

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
        path: 'config/menues',
        component: MenuesComponent
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
        path: 'archivos/rubros',
        component: RubroComponent
      },
      {
        path: 'archivos/lineas',
        component: LineaComponent
      },
      {
        path: 'archivos/especies',
        component: EspecieComponent
      },
      {
        path: 'archivos/medidas',
        component: MedidasComponent
      },
      {
        path: 'archivos/edades',
        component: EdadesComponent
      },
      {
        path: 'archivos/articulos',
        component: ArticuloComponent
      },
      {
        path: 'archivos/presentaciones',
        component: PresentacionesComponent
      },
      {
        path: 'compras',
        loadChildren: () => import(`../../modules/compras/compras.module`)
          .then(
            module => module.ComprasModule
          ),
        canActivate: [IsLoggedGuard,AuthGuard],
        data: {
          roles: ['sys_admin'],
        }

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
