import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserDashboardComponent } from './user-dashboard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';



@NgModule({
  declarations: [
    UserDashboardComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
  ],
  exports: [
    DashboardComponent
  ]

})
export class UserDashboardModule { }
