import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mp-credenciales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './mp-credenciales.component.html',
  styleUrls: ['./mp-credenciales.component.css']
})
export class MpCredencialesComponent {
  private destroy$ = new Subject<any>();

  form = new FormGroup({
    _id: new FormControl({value: null, disabled: true}),
    user_id: new FormControl('', Validators.required),
    client_id: new FormControl('', Validators.required),
    client_secret: new FormControl('', Validators.required),
  })
  prod = new FormGroup({
    key: new FormControl('',Validators.required),
    token: new FormControl('',Validators.required),
  });
  test = new FormGroup({
    key: new FormControl('',Validators.required),
    token: new FormControl('',Validators.required),
  })

  grabar(){

  }
  cancelar(){

  }
}
