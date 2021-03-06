import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// Import library module
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Socket1Service } from './services/socket.service';
//
import { NgxSpinnerModule } from "ngx-spinner";
import { SocketIoModule } from 'ngx-socket-io';
import { ToastrModule } from 'ngx-toastr';
//
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { TestdataComponent } from './components/testdata/testdata.component';
import { HomeComponent } from './components/home/home.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { ApiInterceptor } from './interceptors/api.interceptor';
import { NoPageComponent } from './components/no-page/no-page.component';
import { HtmldataComponent } from './components/htmldata/htmldata.component';
import { SigninBtnComponent } from './components/signin-btn/signin-btn.component';
import { NotifyBtnComponent } from './components/notify-btn/notify-btn.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { PruebaModule } from './modules/prueba/prueba.module';
import { PrivateHomeComponent } from './components/private-home/private-home.component';
//import { ProdNameFilterPipe } from './pipes/prod-name-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TestdataComponent,
    HomeComponent,
    TopMenuComponent,
    NoPageComponent,
    HtmldataComponent,
    SigninBtnComponent,
    NotifyBtnComponent,
    PrivateHomeComponent,
//    ProdNameFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SocketIoModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      //easing: 'ease-out',
      //progressAnimation: 'increasing',
    }),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    PruebaModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Socket1Service,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },

    {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
