import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticuloService } from '../../articulo-edit.service';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ArticuloEditPresentacionesFormComponent } from './articulo-edit-presentaciones-form/articulo-edit-presentaciones-form.component';

@Component({
  selector: 'app-articulo-edit-presentaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ArticuloEditPresentacionesFormComponent
  ],
  templateUrl: './articulo-edit-presentaciones.component.html',
  styleUrls: ['./articulo-edit-presentaciones.component.css']
})
export class ArticuloEditPresentacionesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  _artSvc = inject(ArticuloService);
  regData:any[] = [];
  ready$ = this._artSvc.presentacionesReady$;
  presentaciones$ = this._artSvc.presentacionesData$;
  ready!:boolean;

  async ngOnInit(): Promise<void> {
    if(!this._artSvc.presentacionesReady$.value)
      this._artSvc.readPresentaciones();
    this.presentaciones$
        .pipe(takeUntil(this.destroy$))
        .subscribe( data => {
          this.regData = data
        });
    /*
    this.ready$
        .pipe(takeUntil(this.destroy$))
        .subscribe( state => this.ready = state );
    */
  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
