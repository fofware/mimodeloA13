import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userIsLogged, userLogged } from 'src/app/users/services/users.service';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { ToastService } from 'src/app/services/toast.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastContainerComponent } from '../toast-container/toast-container.component';
import { catchError, map, take, tap } from 'rxjs';
import { UserHomeComponent } from 'src/app/users/components/user-home/user-home.component';
import { UsersComponent } from 'src/app/users/users.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltipModule,
    UserHomeComponent,
    UsersComponent
//    ToastContainerComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  masterData = inject(MasterdataService);
  midata:any;
//  toastService = inject(ToastService);

  ngOnInit(): void {
    //this.readData();
  }

  readData(){
    try {
      this.masterData.get('users/list').pipe(
        take(1),
        map(
          data => this.midata = data
        )
      ).subscribe();
    } catch (error) {
      console.log(error);
    }
  }

  get loggedUser() {
    return userLogged;
  }

  get isLogged() {
    return userIsLogged;
  }

/*
  showStandard() {
		this.toastService.show('I am a standard toast');
	}

	showSuccess() {
		this.toastService.show('I am a success toast', { classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(dangerTpl:any) {
		this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 15000 });
	}

	showWarning() {
		this.toastService.show('Soy un warning', { classname: 'bg-danger text-light', delay: 15000 });
	}
*/
	ngOnDestroy(): void {
//		this.toastService.clear();
	}

}
