import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  proveedor:any = {};
  actrt:any;
  proveedorId:any;

  private destroy$ = new Subject<any>();

  constructor(private router:Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.actrt = this.activatedRoute.params
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(params => {
        console.log(params);
        this.proveedorId = params['id'];
      });
    
  }
  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
