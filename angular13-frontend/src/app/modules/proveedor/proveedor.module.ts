import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProdNameFilterPipe } from 'src/app/pipes/prod-name-filter.pipe';
import { ListapreciosComponent } from './components/listaprecios/listaprecios.component';


@NgModule({
  declarations: [
    ProveedorComponent,
    HomeComponent,
    FormComponent,
    ListComponent,
    MarcaComponent,
    ProductosComponent,
    ArticulosComponent,
    ProdNameFilterPipe,
    ListapreciosComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    ProveedorRoutingModule,
    NgbModule,
    TypeaheadModule.forRoot(),
    ProgressbarModule.forRoot()
  ],
  exports: [

  ]
})
export class ProveedorModule { }
