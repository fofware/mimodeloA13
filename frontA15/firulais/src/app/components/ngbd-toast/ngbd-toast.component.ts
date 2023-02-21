import { Component, inject, OnDestroy } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service';
import { ToastContainerComponent } from '../toast-container/toast-container.component';


@Component({
  selector: 'app-ngbd-toast',
  standalone: true,
  imports: [
    NgbTooltipModule,
    ToastContainerComponent
  ],
  templateUrl: './ngbd-toast.component.html',
  styleUrls: ['./ngbd-toast.component.css']
})
export class NgbdToastComponent {
  toastService = inject(ToastService)
	
	ngOnDestroy(): void {
		this.toastService.clear();
	}
}
