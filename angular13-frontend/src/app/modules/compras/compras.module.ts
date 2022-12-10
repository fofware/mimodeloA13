import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { ComprasComponent } from './compras.component';
import { ProveedorComponent } from '../proveedor/proveedor.component';
import { ProveedorModule } from '../proveedor/proveedor.module';


@NgModule({
  declarations: [
    ComprasComponent,
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
  ]

})
export class ComprasModule { }
