import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { maestroArticuloFd } from 'src/app/maestro/models/maestro.model.articulo';

@Component({
  selector: 'app-list-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.css']
})
export class ListCardComponent {
  @Input() item!:any;
  @Input() idx!:number;

  @Output() onEdit = new EventEmitter<number>()
  @Output() onDelete = new EventEmitter<number>()

  edit() {
    this.onEdit.emit(this.idx);
  }
  borrar() {
    this.onDelete.emit(this.idx);
  }
}
