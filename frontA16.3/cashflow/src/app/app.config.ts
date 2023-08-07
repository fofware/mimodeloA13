import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './interceptors/api.interceptor';
import { tokenInterceptor } from './interceptors/token.interceptor';
//import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

//https://www.youtube.com/watch?v=UqQSjGsL4zg para ngx-socket
//https://www.youtube.com/watch?v=R4VrEUNQMxE

//const config: SocketIoConfig = { url: 'https://wapi.vta.ar'}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    importProvidersFrom(BrowserModule, NgbModule, BrowserAnimationsModule,
       //SocketIoModule.forRoot(config)
       ),
    provideAnimations(),
    provideHttpClient(withInterceptors([apiInterceptor,tokenInterceptor])),
  ],
};

