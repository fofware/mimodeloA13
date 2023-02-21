import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { iAbmFd } from 'src/app/maestro/models/abm';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-abmdatar-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './abmdatar-form.component.html',
  styleUrls: ['./abmdatar-form.component.css'],
})
export class AbmdatarFormComponent implements OnInit {
  _location = inject(Location);
  _router = inject(Router);
  _api = inject(ApiService);

  rtData!:any;
  idx!:number;
  data!:iAbmFd;
  params!:any;
  private destroy$ = new Subject<any>();

  form = new FormGroup({
    _id: new FormControl({value: null, disabled: true}),
    name: new FormControl('', Validators.required),
    images: new FormArray([]),
    icons: new FormArray([])
  })

  ngOnInit(): void {
    this.params = (this._location.getState() as any);
    console.log(this.params);
    if(this.params.navigationId === 1) this._router.navigate(['maestro']);
    else this.setInitData();
  }
  ngOnDestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }
  get images(){
    return (this.form.get('images') as FormArray).controls
  }
  async setInitData(){
    this.idx = this.params.item as number;
    if(this.idx === -1){
      this.data = this.params.newData;
      this.form.controls.name.disable();
    } else {
      this.data = this.params.listData[this.idx];
    }
    this.rtData = this.params.rtData;
    this.form.patchValue(this.data as any);

    this.data.images?.map( (image:any) => {
      const imagesForm = new FormGroup({
        url: new FormControl(image.url)
      });
      (this.form.get('images') as FormArray).push(imagesForm);
    });

    this.data.icons?.map( (icon:any) => {
      const iconsForm = new FormGroup({
        tag: new FormControl(icon.tag)
      });
      (this.form.get('icons') as FormArray).push(iconsForm);
    });

  }
  addImage(){
    (this.form.get('images') as FormArray).push(
      new FormGroup({
        url: new FormControl('', Validators.required)
      })
    )
  }
  get image(){
    return (this.form.get('images') as FormArray).controls
  }
  get icons(){
    return (this.form.get('icons') as FormArray).controls
  }
  addIcon(){
    (this.form.get('icons') as FormArray).push(
      new FormGroup({
        tag: new FormControl('', Validators.required)
      })
    )
  }
  async grabar(){
    this.form.controls.name.enable()
    let data = this.form.value;
    console.log(data);
    let rsta:any = {};
    if (this.idx === -1){
      rsta = await this._api.postP(`/mabm/${this.rtData.coleccion}`,data);
      rsta.value.uso = 0;
      console.log(rsta);
      this.params.listData.push(rsta.value)
    } else {
      const data = this.form.getRawValue();
      console.log(data);
        rsta = await this._api.putP(`/mabm/${this.rtData.coleccion}/${data._id}`,data)
      this.params.listData[this.idx] = Object.assign(this.params.listData[this.idx],data)
      console.log(rsta);
    }

    this._router.navigate([`maestro/${this.rtData.path}`],{state: this.params})
  }
  cancelar(){
    this._router.navigate([`maestro/${this.rtData.path}`],{state: this.params})
  }
}
