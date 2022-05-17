import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// Import library module
import { NgxSpinnerModule } from "ngx-spinner";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketIoModule } from 'ngx-socket-io';
import { ToastrModule } from 'ngx-toastr';


import { TestdataComponent } from './components/testdata/testdata.component';
import { Socket1Service } from './services/socket.service';
import { HomeComponent } from './components/home/home.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { ApiInterceptor } from './interceptors/api.interceptor';
import { NoPageComponent } from './components/no-page/no-page.component';
import { HtmldataComponent } from './components/htmldata/htmldata.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SigninBtnComponent } from './components/signin-btn/signin-btn.component';
import { NotifyBtnComponent } from './components/notify-btn/notify-btn.component';

@NgModule({
  declarations: [
    AppComponent,
    TestdataComponent,
    HomeComponent,
    TopMenuComponent,
    NoPageComponent,
    HtmldataComponent,
    SigninBtnComponent,
    NotifyBtnComponent
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
    })

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Socket1Service,
    {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
