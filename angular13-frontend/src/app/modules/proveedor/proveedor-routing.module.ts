import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageComponent } from 'src/app/components/no-page/no-page.component';
import { FormComponent } from './components/form/form.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '', 
    component: HomeComponent,
    children: [
      //{
      //  path: '', redirectTo: 'temp',
      //  pathMatch: 'full' 
      //},
      {
        path: 'new',
        component: FormComponent,
        //data: {
        //  proveedor: 'new'
        //}
      },
      {
        path: 'edit',
        component: FormComponent
      },
      //{
      //  path: '**',
      //  component: NoPageComponent
      //}
    
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedorRoutingModule { }
