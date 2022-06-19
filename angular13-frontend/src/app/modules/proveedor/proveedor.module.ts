import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorRoutingModule } from './proveedor-routing.module';
import { HomeComponent } from './components/home/home.component';
import { FormComponent } from './components/form/form.component';
import { HttpClientJsonpModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListComponent } from './components/list/list.component';
import { ProveedorComponent } from './proveedor.component';
import { MarcaComponent } from './components/marca/marca.component';


@NgModule({
  declarations: [
    HomeComponent,
    FormComponent,
    ListComponent,
    ProveedorComponent,
    MarcaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientJsonpModule,
    ProveedorRoutingModule,
    NgbModule,

  ]
})
export class ProveedorModule { }
