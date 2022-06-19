import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  proveedor:any = {};
  actrt:any;
  proveedorId:any;
  constructor(private router:Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.actrt = this.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.proveedorId = params['id'];
    });
  }
  ngOnDestroy(){
    //this.actrt.unsuscribe();
  }
}
