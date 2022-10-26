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
import { MedidasComponent } from './components/medidas/medidas.component';
import { EdadesComponent } from './components/edades/edades.component';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PresentacionesComponent } from './components/presentaciones/presentaciones.component';
//import { PresentacionesFormEditComponent } from './components/presentaciones-form-edit/presentaciones-form-edit.component';
import { ArticuloFormArticuloEditComponent } from './components/articulo-form-articulo-edit/articulo-form-articulo-edit.component';
import { ArticuloFormPresentacionesEditComponent } from './components/articulo-form-presentaciones-edit/articulo-form-presentaciones-edit.component';
//import { ArticuloFormFormulaEditComponent } from './components/articulo-form-formula-edit/articulo-form-formula-edit.component';
import { ArticuloFormExtradataEditComponent } from './components/articulo-form-extradata-edit/articulo-form-extradata-edit.component';
import { ExtraDataFilterPipe } from 'src/app/pipes/extra-data-filter.pipe';

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
    MenuesComponent,
    MedidasComponent,
    EdadesComponent,
    PresentacionesComponent,
//    PresentacionesFormEditComponent,
    ArticuloFormArticuloEditComponent,
    ArticuloFormPresentacionesEditComponent,
//    ArticuloFormFormulaEditComponent,
    ArticuloFormExtradataEditComponent,
    ExtraDataFilterPipe

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    NgbModule,
    //BrowserAnimationsModule,
    ReactiveFormsModule,
    SortableModule.forRoot()
  ]
})
export class AdminModule { }
