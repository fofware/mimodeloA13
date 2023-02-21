import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes'
import { apiInterceptor } from './app/interceptors/api.interceptor';
import { tokenInterceptor } from './app/interceptors/token.interceptor';

//import { AppModule } from './app/app.module';

bootstrapApplication(AppComponent,{
  providers:[
    provideRouter(appRoutes),
    importProvidersFrom(NgbModule, BrowserAnimationsModule),
    provideHttpClient(withInterceptors([tokenInterceptor])),
//    provideHttpClient(withInterceptors([apiInterceptor,tokenInterceptor])),
//    importProvidersFrom(TypeaheadModule.forRoot())
  ]
});
/*
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
*/
