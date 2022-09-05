import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  formProfile = this.fb.group({
    nombre: ['',
      [
        Validators.required,
        Validators.minLength(3)
      ]],
      apellido: [''],
      direccion: [''],
      ciudad: [''],
      zipcode: [''],
      phone: ['',[Validators.minLength(10), Validators.maxLength(10), Validators.pattern(`^[0-9]+$`)]],
  });
  private destroy$ = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOndestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }

  enviar(){
        console.log("Envia", this.formProfile.value);
  }

  isInvalid(fieldname:string){
    const campo = this.formProfile.get(fieldname);
    console.log(fieldname, campo?.invalid, campo?.touched, campo?.invalid && campo?.touched)
    return campo?.invalid && campo?.touched;
  }

}
