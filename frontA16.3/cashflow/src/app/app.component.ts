import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { RouterOutlet } from '@angular/router';
import { NgbdToastComponent } from './components/ngbd-toast/ngbd-toast.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopMenuComponent,
    ToastContainerComponent,
    NgbdToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cashflow';
}
