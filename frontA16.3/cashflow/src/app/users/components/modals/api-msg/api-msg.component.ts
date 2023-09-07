import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-api-msg',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './api-msg.component.html',
  styleUrls: ['./api-msg.component.scss']
})
export class ApiMsgComponent {
  @Input() data!:any;
  activeModal = inject(NgbActiveModal)

}
