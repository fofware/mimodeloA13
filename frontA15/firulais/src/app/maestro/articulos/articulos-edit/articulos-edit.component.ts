import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { iTopMenu } from 'src/app/services/top-menu.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArticuloService } from '../articulo-edit.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-articulos-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  templateUrl: './articulos-edit.component.html',
  styleUrls: ['./articulos-edit.component.css']
})
export class ArticulosEditComponent implements OnInit, OnDestroy {
  public isMenuCollapsed = true;
  public isLogged = false;
  user:any = {};

  public defmenu:iTopMenu[] = [

    { title: '<i class="fa-solid fa-rotate-left"></i>', link: ['..'] },
    { title: '<i class="fa-solid fa-sliders"></i>', link: 'data' },
    //{ title: 'Nombre', link: ['name'], hidden: this.isLogged, roles: ['sys_admin', 'sys_user'] },
    { title: '<i class="fa-solid fa-boxes-packing"></i>', link: ['presentaciones'], hidden: this.isLogged, roles: ['sys_admin', 'sys_user'] },
    { title: '<i class="fa-solid fa-circle-info"></i>', link: ['detalles'], hidden: this.isLogged, roles: ['sys_admin', 'sys_user'] },
    { title: '<i class="fa-solid fa-kitchen-set"></i>', link: ['formula'], hidden: this.isLogged, roles: ['sys_admin', 'sys_user'] },
    { title: 'Beneficios', link: ['beneficios'], hidden: this.isLogged, roles: ['sys_admin', 'sys_user'] },
  ];

  usrMenu:iTopMenu[] = [];

  _location = inject(Location);

  _router = inject(Router);
  _aRouter = inject(ActivatedRoute);
  _api = inject(ApiService);

  _auth = inject(AuthService);
  _artSvc = inject(ArticuloService);
  retpage!:string;
  params!:any;
  regData:any;
  filesReady$ = this._artSvc.filesReady$;
  ready:any;
  destroy$ = new Subject<any>();

  ngOnInit(): void {
    const locationData = this._location.getState() as any;
    this.retpage = locationData.from;
    console.log(locationData);
    /*
    this.filesReady$
        .pipe(takeUntil(this.destroy$))
        .subscribe( state => this.ready = state );
    console.log(this.ready)
    if(!this.ready) this._artSvc.readFiles();
    */
    this.user = this._auth.userValue;
    //console.warn("EditService",this._editService._location.getState());
    this.setMenu();
    //let storageData = localStorage.getItem('articulo_edit');
    //if(storageData) storageData = JSON.parse(storageData);
    //let locationData = (this._editService._location.getState() as any);
    //locationData = Object.assign(locationData,storageData);

    //console.log('locationData en Edit',locationData);
    /*
    const snapshotData:any = (this._arouter.snapshot.params)
    console.log('snapshotData',snapshotData);
    if(snapshotData._id){
      this.params = snapshotData;
      this.regData = await this._api.getP(`/articulo/maestro/${snapshotData._id}`)
      this.ready = true
      console.log("Editando",this.regData);
    }
    */
    /*
    if(locationData.from){
      this.params = locationData;
      this.regData = locationData.listData[locationData.idx];
      this.ready = true;
    }
    */
    /*
    console.log('E IDX',this._artSvc.idx.value);
    if(this._artSvc.idx.value > -1)
      this.regData = this._artSvc.listData.value[this._artSvc.idx.value];
    console.log(this.regData);
    */
    /*
    console.log(this._editService.regData);
    console.log(this._editService.regData.value);
    console.log('Params',this.params);
    */

  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  setMenu(){
    console.log('SetMenu in TopMenu');
    this.usrMenu = this.defmenu.filter( item => {
      if (item.roles?.length){
        for (let ir = 0; ir < item.roles.length; ir++) {
          const rol = item.roles[ir];
          if(this._auth.userValue.roles.indexOf(rol) > -1) return true;
        }
        return false;
      } return true;
    })
    console.log("Menu",this.usrMenu);
  }

}
