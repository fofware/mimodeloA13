import { Component, inject, TemplateRef } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [
    NgbToastModule,
    NgIf,
    NgTemplateOutlet,
    NgFor
  ],
  template: `
	  <ngb-toast
			*ngFor="let toast of toastService.toasts"
			header={{toast.header}}
			[class]="toast.classname"
			[autohide]="true"
			[delay]="toast.delay || 5000"
			(hidden)="toastService.remove(toast)"
		>
			<ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
			  <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
			</ng-template>

			<ng-template #text><span [innerHTML]="toast.textOrTpl"></span></ng-template>
		</ngb-toast>
  `,
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 2001' },
  //styles: [ ]
})
export class ToastContainerComponent {
	toastService = inject(ToastService);

  isTemplate(toast:any) {
		return toast.textOrTpl instanceof TemplateRef;
	}
}
