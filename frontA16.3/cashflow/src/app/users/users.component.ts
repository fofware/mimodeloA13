import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VMenuComponent } from '../components/v-menu/v-menu.component';
import { NgClass, NgIf } from '@angular/common';
import { UsersService, userLogged, userVMenu } from './services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    RouterOutlet,
    VMenuComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public _user = inject(UsersService);
  isEncaMenu = false;
  isEncaPage = false;

  ngOnInit(): void {
  //  this.setMenu()
  }

  async setMenu(){
    /*
    if(userLogged().emailvalidated)
      userVMenu.set(await this._user.getVMenuP('usersHome') );
    */
    console.log(userVMenu());
  }
}
