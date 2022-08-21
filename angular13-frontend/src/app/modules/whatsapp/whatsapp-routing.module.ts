import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageComponent } from 'src/app/components/no-page/no-page.component';
import { WappconnectComponent } from './components/wappconnect/wappconnect.component';
import { WhatsappComponent } from './whatsapp.component';

const routes: Routes =   [
  {
  path: '',
  component: WhatsappComponent,
  children: [
    //
    // https://www.tektutorialshub.com/angular/angular-pass-data-to-route/
    // https://www.tektutorialshub.com/angular/angular-passing-parameters-to-route/
    // https://www.tektutorialshub.com/angular/angular-child-routes-nested-routes/
    //
    {
      path: 'connect',
      component: WappconnectComponent
    },    
    {
      path: '**',
      component: NoPageComponent
    }
  ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WhatsappRoutingModule { }
