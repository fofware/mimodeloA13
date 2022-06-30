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
import { ProductosComponent } from './components/productos/productos.component';
import { ArticulosComponent } from './components/articulos/articulos.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    HomeComponent,
    FormComponent,
    ListComponent,
    ProveedorComponent,
    MarcaComponent,
    ProductosComponent,
    ArticulosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientJsonpModule,
    ProveedorRoutingModule,
    NgbModule,
    TypeaheadModule.forRoot(),


  ]
})
export class ProveedorModule { }
