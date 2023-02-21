import { Component, OnInit } from '@angular/core';
//import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
//  public formProveedor: FormGroup = new FormGroup({});

  proveedor:any = {};
  actrt:any;
  proveedorId:any;

  private destroy$ = new Subject<any>();

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private apiSrv: ApiService) { }

  ngOnInit(): void {
//    this.initFormProveedor()
    this.actrt = this.activatedRoute.params
      .pipe( takeUntil(this.destroy$) )
      .subscribe(params => {
        console.log(params);
        this.proveedorId = params['id'];
        if(this.proveedorId !== 'new'){
          this.apiSrv.get(`/proveedor/${this.proveedorId}`)
          .subscribe(data => {
            console.log(data)
            this.proveedor = data;
          })
        }
      });
  }

  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }
/*
  initFormProveedor():void {
    this.formProveedor = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(10)]),
        skills: new FormArray([], [Validators.required])
      }
    )
  }

  initFormListas(): FormGroup {
    return new FormGroup(
      {
        email: new FormControl(''),
        celular: new FormControl(''),
        password: new FormControl('', [Validators.required])
      }
    )
  }

  getCtrl(key: string, form: FormGroup): any {
    return form.get(key);
  }

  addSkill(): void {
    const refListas = this.formProveedor.get('skills') as FormArray;
    refListas.push(this.initFormListas());
  }
*/
  saveData(){
    if(!this.proveedor._id){
      console.log('Add',this.proveedor);
      this.apiSrv.post('/proveedor',this.proveedor).subscribe((data:any) => {
        console.log(data);
      })
    } else {
      console.log('Modifica',this.proveedor);
      this.apiSrv.post('/proveedor',this.proveedor).subscribe((data:any) => {
        console.log(data);
      });
    }
  }
}
