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
  styleUrls: ['./ngbd-toast.component.scss']
})
export class NgbdToastComponent {
  toastService = inject(ToastService)

	ngOnDestroy(): void {
		this.toastService.clear();
	}

  showStandard() {
		this.toastService.show('I am a standard toast');
	}

	showSuccess() {
		this.toastService.show('I am a success toast', { classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(dangerTpl:any) {
		this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 15000 });
	}

  warning(titulo:string, texto:string){
    this.toastService.show(texto, { classname: 'bg-success text-light', delay: 10000 });
  }
}
