import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageComponent } from 'src/app/components/no-page/no-page.component';
import { HomeComponent } from './components/home/home.component';
import { MreplaceComponent } from './components/mreplace/mreplace.component';

const routes: Routes = [
  {
    path: '', 
    component: HomeComponent,
    children: [
      {
        path: 'mreplace',
        component: MreplaceComponent
      },
      //{
      //  path: '', redirectTo: 'temp',
      //  pathMatch: 'full' 
      //},
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
export class TempRoutingModule { }
