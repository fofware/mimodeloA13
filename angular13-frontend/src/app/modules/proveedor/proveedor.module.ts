import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorRoutingModule } from './proveedor-routing.module';
import { HomeComponent } from './components/home/home.component';
import { FormComponent } from './components/form/form.component';
import { HttpClientJsonpModule } from '@angular/common/http';


@NgModule({
  declarations: [
    HomeComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientJsonpModule,
    ProveedorRoutingModule
  ]
})
export class ProveedorModule { }
