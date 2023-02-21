import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { iAbmFd } from 'src/app/maestro/models/abm';

@Component({
  selector: 'app-abmdata-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './abmdata-form.component.html',
  styleUrls: ['./abmdata-form.component.css']
})

export class AbmdataFormComponent implements OnInit{
  @Input()  data!:iAbmFd;
  @Input()  idx!: number;
  @Output() dataChange = new EventEmitter<iAbmFd>();
  @Output() onDelete = new EventEmitter<number>()
  estado = "hideform"
  form = new FormGroup({
    _id: new FormControl(null),
    name: new FormControl('', Validators.required),
    images: new FormArray([]),
    icons: new FormArray([])
  })
  ngOnInit(): void{
    console.log(this.data);
    this.form.patchValue(this.data as any);
  }
  get images(){
    return (this.form.get('images') as FormArray).controls
  }
  addImage(){
    (this.form.get('images') as FormArray).push(
      new FormGroup({
        url: new FormControl('', Validators.required)
      })
    )
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
  grabar(){
    this.dataChange.emit(this.data)
  }
  edit(){
    this.data.selected=true;
    this.estado = '';
    this.dataChange.emit(this.data)
  }
  delete(){
    this.data.selected=false;
    this.estado = 'hideform';
    this.dataChange.emit(this.data);
    this.onDelete.emit(this.idx);
  }
  cancel(){
    this.data.selected=false;
    this.estado = 'hideform';
    this.dataChange.emit(this.data);
  }
}
