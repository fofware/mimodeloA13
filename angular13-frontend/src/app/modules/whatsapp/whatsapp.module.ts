import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhatsappRoutingModule } from './whatsapp-routing.module';
import { WhatsappComponent } from './whatsapp.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentComponent } from './components/document/document.component';
import { FormsModule } from '@angular/forms';
import { Socket2Service } from 'src/app/services/socket.service';
import { WappclientComponent } from './components/wappclient/wappclient.component';
import { WappconnectComponent } from './components/wappconnect/wappconnect.component';


@NgModule({
  declarations: [
    WhatsappComponent,
    DocumentListComponent,
    DocumentComponent,
    WappclientComponent,
    WappconnectComponent
  ],
  providers:[
    Socket2Service,
  ],
  imports: [
    FormsModule,
    CommonModule,
    WhatsappRoutingModule,

  ]
})
export class WhatsappModule { }
