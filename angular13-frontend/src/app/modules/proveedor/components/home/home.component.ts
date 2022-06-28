import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProveedoresService } from '../../../../services/proveedores.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  actrt:any;
  proveedorId:any;
  proveedor:any;
  public isMenuCollapsed = true;

  public defmenu = [
    //{ title: '<i class="fa-solid fa-arrow-rotate-left"></i>', link: '../' },
    { title: 'Marcas', link: ['marcas'] },
    //{ title: 'Articulos', link: ['articulos'] },
    { title: 'Productos', link: ['producto'] },
    { title: 'listas', link: ['lista'] },
    //{ title: 'Socket', link: ['socketdata'] },
    //{ title: 'HttpData', link: ['htmldata'] },
    //{ title: 'Usuarios', link: ['users'] },
    //{ title: 'Proveedores', link: ['proveedores'] },
    //{ title: 'Temporal', link: ['temp'] },
  ];

  private destroy$ = new Subject<any>();

  constructor(
    private router : Router,
    public activatedRoute: ActivatedRoute,
    private provData: ProveedoresService
  ) { }

  ngOnInit(): void {
    /*
    this.actrt = this.activatedRoute.params
    .pipe( takeUntil(this.destroy$) )
    .subscribe(params => {
      console.log(params);
      //this.proveedorId = params['id'];
      this.proveedor = this.provData.get(params['id']);

      //this.defmenu[0].title = this.proveedor.name;
    });
    */
  }

  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
