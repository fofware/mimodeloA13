import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  @Input() coleccion!:string;

  @Output() onEdit = new EventEmitter<number>()
  @Output() onDelete = new EventEmitter<number>()

  edit() {
    this.onEdit.emit(this.idx);
  }
  borrar() {
    this.onDelete.emit(this.idx);
  }
}
