import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageComponent } from 'src/app/components/no-page/no-page.component';
import { WappclientComponent } from './components/wappclient/wappclient.component';
import { WappconnectComponent } from './components/wappconnect/wappconnect.component';
import { WhatsappContactosComponent } from './components/whatsapp-contactos/whatsapp-contactos.component';
import { WhatsappHomeComponent } from './components/whatsapp-home/whatsapp-home.component';
import { WhatsappWebComponent } from './components/whatsapp-web/whatsapp-web.component';
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
    //{
    //  path:'home'
    //  cpmponent:
    //}
    {
      path: '',
      component: WhatsappHomeComponent
    },
    {
      path: 'client',
      component: WappclientComponent
    },
    {
      path: 'connect',
      component: WappconnectComponent
    },
    {
      path: 'web',
      component: WhatsappWebComponent
    },
    {
      path: 'contactos',
      component: WhatsappContactosComponent
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
