import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-articulo-edit-extradata-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './articulo-edit-extradata-form.component.html',
  styleUrls: ['./articulo-edit-extradata-form.component.css']
})
export class ArticuloEditExtradataFormComponent implements OnInit, OnDestroy {
  @Input() reg!:any;
  form = new FormGroup({
    _id: new FormControl(null),
    articulo: new FormControl(''),
    proceso: new FormControl(''),
    name: new FormControl(''),
    value: new FormControl(''),
    showname: new FormControl(''),
    showvalue: new FormControl(''),
    iconos: new FormArray([])
  })
  ngOnInit() {
    this.form.patchValue(this.reg as any);
  }
  ngOnDestroy(): void {
    console.log('touched',this.form.touched);
    console.log(this.form);
  }
  delete(){
    console.log(this.form.getRawValue());
    console.log(this.reg);
  }
}
