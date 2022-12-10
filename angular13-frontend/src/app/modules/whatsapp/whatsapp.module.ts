import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsappRoutingModule } from './whatsapp-routing.module';
import { WhatsappComponent } from './whatsapp.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentComponent } from './components/document/document.component';
import { FormsModule } from '@angular/forms';
import { WappclientComponent } from './components/wappclient/wappclient.component';
import { WappconnectComponent } from './components/wappconnect/wappconnect.component';
import { QRCodeModule } from 'angularx-qrcode';

//import { Socket2Service } from 'src/app/services/socket.service';
//import { HTTP_INTERCEPTORS } from '@angular/common/http';
//import { TokenInterceptor } from 'src/app/interceptors/token.interceptor';
import { WhatsappWebComponent } from './components/whatsapp-web/whatsapp-web.component';
import { WhatsappChatsComponent } from './components/whatsapp-chats/whatsapp-chats.component';
import { WhatsappMsgsComponent } from './components/whatsapp-msgs/whatsapp-msgs.component';
import { WappmsgsListComponent } from './components/wappmsgs-list/wappmsgs-list.component';
import { WappchatsListComponent } from './components/wappchats-list/wappchats-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WhatsappHomeComponent } from './components/whatsapp-home/whatsapp-home.component';
import { WhatsappContactosComponent } from './components/whatsapp-contactos/whatsapp-contactos.component';
import { WhatsappContactsCardComponent } from './components/whatsapp-contacts-card/whatsapp-contacts-card.component';
import { MsgImageComponent } from './components/msg-image/msg-image.component';
import { MsgPttComponent } from './components/msg-ptt/msg-ptt.component';
import { MsgVideoComponent } from './components/msg-video/msg-video.component';
import { MsgStickerComponent } from './components/msg-sticker/msg-sticker.component';
import { MsgDocumentComponent } from './components/msg-document/msg-document.component';
import { MsgAudioComponent } from './components/msg-audio/msg-audio.component';
import { SocketIoModule } from 'ngx-socket-io';


@NgModule({
  declarations: [
    WhatsappComponent,
    DocumentListComponent,
    DocumentComponent,
    WappclientComponent,
    WappconnectComponent,
    WhatsappWebComponent,
    WhatsappChatsComponent,
    WhatsappMsgsComponent,
    WappmsgsListComponent,
    WappchatsListComponent,
    WhatsappHomeComponent,
    WhatsappContactosComponent,
    WhatsappContactsCardComponent,
    MsgImageComponent,
    MsgPttComponent,
    MsgVideoComponent,
    MsgStickerComponent,
    MsgDocumentComponent,
    MsgAudioComponent
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
    QRCodeModule,
    NgbModule,
  ],
  //schemas:[
  //  CUSTOM_ELEMENTS_SCHEMA,
  //  NO_ERRORS_SCHEMA
  //]
})
export class WhatsappModule { }
