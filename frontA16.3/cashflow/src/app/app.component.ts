import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgbdToastComponent } from './components/ngbd-toast/ngbd-toast.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { filter } from 'rxjs';
import { UsersService, userTopMenu } from './users/services/users.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    TopMenuComponent,
    ToastContainerComponent,
    NgbdToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'cashflow';
  route = inject(Router);
  userService = inject(UsersService);

  breadcrumb:any = [];

  ngOnInit(): void {
    this.userService.decodeToken(this.userService.getToken());

    this.makeBreadcrumb(this.route.url);
    console.log(this.route.events);

    this.route.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe( (event: any) => {
        console.log("NavigationEnd",event)
        this.makeBreadcrumb(event.urlAfterRedirects)
      });
  }
  makeBreadcrumb(url:string) {
    this.breadcrumb = [];
    const array:any = url.split('/').slice(1,-1);
    let parent = ''
    let links = ['']
    array.map( (e:any) => {
//      const data = this.menuService.get(e);
//      const link = parent === '' ? e : `${parent}/${e}`
      links.push(e);
      const link = JSON.parse(JSON.stringify(links));
      this.breadcrumb.push( {link,title:`${link}`} );
//      this.breadcrumb.push( {link,title:data.title} );
      //parent = e;
    })

  }

}
