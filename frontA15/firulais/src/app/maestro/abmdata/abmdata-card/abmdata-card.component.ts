import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { iAbmFd } from 'src/app/maestro/models/abm';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-abmdata-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abmdata-card.component.html',
  styleUrls: ['./abmdata-card.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush

})
export class AbmdataCardComponent implements OnInit, OnDestroy {
  @Input() item!:iAbmFd;
  @Input() idx!:number;
  @Input() coleccion!:string;

  @Output() onEdit = new EventEmitter<number>()
  @Output() onDelete = new EventEmitter<number>()

  private destroy$ = new Subject<any>();

  //_api = inject(ApiService);
  //uso = 0;

  ngOnInit(): void {
    /*
    const params = {
      file: this.coleccion,
      _id: this.item._id
    }

    this._api.get(`/articulos/file`,params)
    .pipe(takeUntil(this.destroy$))
    .subscribe( res => {
      this.uso = res.length;
    });
    */
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
  edit(){
    this.onEdit.emit(this.idx)
  }
  borrar(){
    this.onDelete.emit(this.idx)
  }
}
