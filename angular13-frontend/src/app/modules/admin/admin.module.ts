import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './admin.component';
import { FabricanteComponent } from './components/fabricante/fabricante.component';
import { MarcaComponent } from './components/marca/marca.component';
import { RubroComponent } from './components/rubro/rubro.component';
import { LineaComponent } from './components/linea/linea.component';
import { EspecieComponent } from './components/especie/especie.component';
import { RazaComponent } from './components/raza/raza.component';
import { ArticuloComponent } from './components/articulo/articulo.component';
import { PresentacionComponent } from './components/presentacion/presentacion.component';
import { ArticuloFormComponent } from './components/articulo-form/articulo-form.component';
import { MenuesComponent } from './components/menues/menues.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    HomeComponent,
    AdminComponent,
    FabricanteComponent,
    MarcaComponent,
    RubroComponent,
    LineaComponent,
    EspecieComponent,
    RazaComponent,
    ArticuloComponent,
    PresentacionComponent,
    ArticuloFormComponent,
    MenuesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    //BrowserAnimationsModule,
    ReactiveFormsModule,

  ]
})
export class AdminModule { }
