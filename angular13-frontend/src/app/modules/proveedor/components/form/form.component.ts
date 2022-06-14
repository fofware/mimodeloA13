import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  proveedor:any = {};

  constructor(private router:Router, private activatedroute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedroute.paramMap.subscribe(params => {
      console.log(params);
      //this.proveedor = params.get('id');
      //console.log(this.proveedor);
    });
  }

}
