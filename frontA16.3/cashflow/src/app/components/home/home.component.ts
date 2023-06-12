import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userIsLogged, userLogged } from 'src/app/users/services/users.service';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { ToastService } from 'src/app/services/toast.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastContainerComponent } from '../toast-container/toast-container.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    ToastContainerComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  masterData = inject(MasterdataService);
  midata:any;
  toastService = inject(ToastService);

  ngOnInit(): void {
    this.midata = this.masterData.get('cosas');
  }

  get loggedUser() {
    return userLogged;
  }
  get isLogged() {
    return userIsLogged;
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

	ngOnDestroy(): void {
		this.toastService.clear();
	}

}
