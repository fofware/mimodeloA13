import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-articulo-edit-presentaciones-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './articulo-edit-presentaciones-form.component.html',
  styleUrls: ['./articulo-edit-presentaciones-form.component.css']
})
export class ArticuloEditPresentacionesFormComponent {

  @Input() reg!:any;
  @Output() regChange = new EventEmitter<any>();

  form = new FormGroup({
    _id: new FormControl(null),
    ean: new FormControl(''),
    plu: new FormControl(''),
    name: new FormControl('', Validators.required),
    contiene: new FormControl(''),
    unidad: new FormControl(''),
    images: new FormArray([]),
    relacion: new FormControl(''),
    tags: new FormArray([])
  });
  ngOnInit(){
    this.setInitData();
  }
  async setInitData(){
    /*
    if(this.idx === -1){
      this.data = this.params.newData;
      this.form.controls.name.disable();
    } else {
      this.data = this.params.listData[this.idx];
    }
    */
    console.log(this.reg);
    this.form.patchValue(this.reg as any);
    /*
    this.reg?.images?.map( (image:any) => {
      const imagesForm = new FormGroup({
        url: new FormControl(image.url)
      });
      (this.form.get('images') as FormArray).push(imagesForm);
    });
    */
  }

  addImage(){

  }

}
