import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhatsappRoutingModule } from './whatsapp-routing.module';
import { WhatsappComponent } from './whatsapp.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentComponent } from './components/document/document.component';
import { FormsModule } from '@angular/forms';
import { WappclientComponent } from './components/wappclient/wappclient.component';
import { WappconnectComponent } from './components/wappconnect/wappconnect.component';
import { QRCodeModule } from 'angularx-qrcode';

import { Socket2Service } from 'src/app/services/socket.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/interceptors/token.interceptor';


@NgModule({
  declarations: [
    WhatsappComponent,
    DocumentListComponent,
    DocumentComponent,
    WappclientComponent,
    WappconnectComponent
  ],
  providers:[
  //  Socket2Service,
  //  {
  //    provide: HTTP_INTERCEPTORS,
  //    useClass: TokenInterceptor,
  //    multi: true
  //  },
  ],
  imports: [
    FormsModule,
    CommonModule,
    WhatsappRoutingModule,
    QRCodeModule

  ]
})
export class WhatsappModule { }
