import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenuComponent } from './common/top-menu/top-menu.component';
import { HeaderComponent } from './common/header/header.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
      RouterOutlet,
      TopMenuComponent,
    ]
})
export class AppComponent {
  title = 'cashflow';
}
