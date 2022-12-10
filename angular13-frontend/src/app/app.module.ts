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
import { Socket2Service } from './services/socket.service';
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
import { ArticulosPublicComponent } from './components/articulos-public/articulos-public.component';
import { ProductosPublicComponent } from './components/productos-public/productos-public.component';
import { ArticulosCardComponent } from './components/articulos-card/articulos-card.component';
import { ProductosCardComponent } from './components/productos-card/productos-card.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormhijosComponent } from './components/formhijos/formhijos.component';
import { EmailcheckDirective } from './validators/emailcheck.directive';
import { TestValidatorDirective } from './validators/test-validator.directive';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { UserDashboardModule } from './modules/user-dashboard/user-dashboard.module';
import { TestModule } from './modules/test/test.module';
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
    ArticulosPublicComponent,
    ProductosPublicComponent,
    ArticulosCardComponent,
    ProductosCardComponent,
    SignupComponent,
    FormhijosComponent,
    EmailcheckDirective,
    TestValidatorDirective,
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
    UserDashboardModule,
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
    RecaptchaV3Module,
    TestModule,
    SocketIoModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    //Socket1Service,
    Socket2Service,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey
    },
    {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
