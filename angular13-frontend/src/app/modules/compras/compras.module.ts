import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { ComprasComponent } from './compras.component';
import { ProveedorComponent } from '../proveedor/proveedor.component';
import { ProveedorModule } from '../proveedor/proveedor.module';
import { ListasPreciosComponent } from './components/listas-precios/listas-precios.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListasPreciosNavComponent } from './components/listas-precios-nav/listas-precios-nav.component';


@NgModule({
  declarations: [
    ComprasComponent,
    ListasPreciosComponent,
    ListasPreciosNavComponent,
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    NgbModule,
    TypeaheadModule.forRoot(),

  ]

})
export class ComprasModule { }
