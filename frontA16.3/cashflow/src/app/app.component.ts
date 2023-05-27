import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopMenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cashflow';
}
