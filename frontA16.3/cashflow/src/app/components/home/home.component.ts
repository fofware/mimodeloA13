import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userIsLogged, userLogged } from 'src/app/users/services/users.service';
import { MasterdataService } from 'src/app/services/masterdata.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  masterData = inject(MasterdataService)
  midata:any;

  ngOnInit(): void {
    this.midata = this.masterData.get('cosas');
  }

  get loggedUser() {
    return userLogged;
  }
  get isLogged() {
    return userIsLogged;
  }
}
