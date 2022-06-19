import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {

  public isMenuCollapsed = true;

  public defmenu = [
    { title: '<i class="fas fa-home-lg fa-lg"></i>', link: 'home' },
    { title: 'Marcas', link: ['marca'] },
    { title: 'Articulos', link: ['articulos'] },
    { title: 'Productos', link: ['producto'] },
    { title: 'Appicaciones', link: ['private','menu'] },
    { title: 'Socket', link: ['socketdata'] },
    { title: 'HttpData', link: ['htmldata'] },
    { title: 'Usuarios', link: ['users'] },
    { title: 'Proveedores', link: ['proveedores'] },
    { title: 'Temporal', link: ['temp'] },
  ];
  constructor( public route: ActivatedRoute ) { }

  ngOnInit(): void {

  }

}
