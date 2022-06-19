import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public isMenuCollapsed = true;
  proveedores:any;

  constructor(
    private router : Router,
    private provData: ProveedoresService
  ) { }

  ngOnInit(): void {
    this.proveedores = this.provData.get();
  }

  gotoDynamic(item:any) {
    //this.router.navigateByUrl('/dynamic', { state: { id:1 , name:'Angular' } });
    //console.log(item);
    this.router.navigate(['proveedores', item.id] );
  }

}
