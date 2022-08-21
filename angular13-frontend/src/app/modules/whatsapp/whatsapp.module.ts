import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhatsappRoutingModule } from './whatsapp-routing.module';
import { WhatsappComponent } from './whatsapp.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentComponent } from './components/document/document.component';
import { FormsModule } from '@angular/forms';
import { Socket2Service } from 'src/app/services/socket.service';


@NgModule({
  declarations: [
    WhatsappComponent,
    DocumentListComponent,
    DocumentComponent
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
