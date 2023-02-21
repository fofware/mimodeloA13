import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticuloListComponent } from './components/articulo-list/articulo-list.component';
import { MenuListComponent } from './components/menu-list.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'articulos'},
  {path: 'menu', component: MenuListComponent},
  {path: 'articulos', component: ArticuloListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
