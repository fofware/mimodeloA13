import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TempRoutingModule } from './temp-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MreplaceComponent } from './components/mreplace/mreplace.component';


@NgModule({
  declarations: [
    HomeComponent,
    MreplaceComponent
  ],
  imports: [
    CommonModule,
    TempRoutingModule
  ]
})
export class TempModule { }
