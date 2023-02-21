import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticuloService } from '../../articulo-edit.service';
import { ActivatedRoute } from '@angular/router';
import { ArticuloEditExtradataFilterPipe } from './articulo-edit-extradata-filter.pipe';
import { ArticuloEditExtradataFormComponent } from './articulo-edit-extradata-form/articulo-edit-extradata-form.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-articulo-edit-extradata',
  standalone: true,
  imports: [
    CommonModule,
    ArticuloEditExtradataFilterPipe,
    ArticuloEditExtradataFormComponent
  ],
  templateUrl: './articulo-edit-extradata.component.html',
  styleUrls: ['./articulo-edit-extradata.component.css']
})
export class ArticuloEditExtradataComponent implements OnInit, OnDestroy {
  _aRoute = inject(ActivatedRoute);
  _artSvc = inject(ArticuloService);
  process = '';
  data:any[] = [];
  destroy$ = new Subject<any>();
  data$ = this._artSvc.extraData$;

  ngOnInit(): void {
    const params:any = this._aRoute.snapshot.data;
    this.process = params.process;
    this.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      console.log(data);
      this.data = [];
      if(data.rows)
        data?.rows.map((reg:any) => this.data.push(reg));
    });
    console.log(this._artSvc.extraReady$.value)
    if(!this._artSvc.extraReady$.value)
      this._artSvc.readExtraData();
    console.log(this.process);
  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
