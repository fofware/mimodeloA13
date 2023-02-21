import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArticuloService } from './articulo-edit.service';

@Component({
  selector: 'app-articulos',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})
export class ArticulosComponent implements OnInit {
  _router = inject(Router);
  //_artSvc = inject(ArticuloService);

  ngOnInit(): void {
    /*
    const storageData = localStorage.getItem('articulo_edit');
    console.log('ArticulosComponent',storageData);
    if (storageData){
      const state = JSON.parse(storageData);
      this._router.navigate([`maestro/articulos/edit/data`],{ state });
    }
    */
  }
}
