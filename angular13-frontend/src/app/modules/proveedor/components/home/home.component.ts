import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProveedoresService } from '../../../../services/proveedores.service';
//https://www.tektutorialshub.com/angular/angular-child-routes-nested-routes/
//https://www.tektutorialshub.com/angular/angular-child-routes-nested-routes/
//https://www.freakyjolly.com/angular-nested-routing-with-multiple-routeroutlet-using-loadchildren-having-own-router-modules-example-application/
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  actrt:any;
  proveedorId:any;
  proveedor:any = {};
  //public isMenuCollapsed = true;

  public defmenu = [
    //{ title: '<i class="fa-solid fa-arrow-rotate-left"></i>', link: '../' },
    //{ title: 'Marcas', link: ['marcas'] },
    //{ title: 'Articulos', link: ['articulos'] },
    { title: 'Productos', link: ['productos'] },
    { title: 'Precios', link: ['precios'] },
  ];

  private destroy$ = new Subject<any>();

  constructor(
    private router : Router,
    public activatedRoute: ActivatedRoute,
    private provData: ProveedoresService
  ) { }

  ngOnInit(): void {
    this.actrt = this.activatedRoute.params
    .pipe( takeUntil(this.destroy$) )
    .subscribe(params => {
      console.log(params);
      this.proveedorId = params['id'];
      if(params['id'])
        this.proveedor = this.provData.get(params['id'])
        .subscribe(data => this.proveedor = data);
    });

  }

  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
