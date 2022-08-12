import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-productos-public',
  templateUrl: './productos-public.component.html',
  styleUrls: ['./productos-public.component.css']
})
export class ProductosPublicComponent implements OnInit {
  public screenWidth: any;
  public screenHeight: any;

  constructor() { }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
}
