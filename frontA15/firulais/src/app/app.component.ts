import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastComponent } from './components/ngbd-toast/ngbd-toast.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:[
    RouterModule,
    NgbModule,
    NgbdToastComponent,
    TopMenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'firulais';
}
