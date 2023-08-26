import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userLogged } from '../../services/users.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-validate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './email-validate.component.html',
  styleUrls: ['./email-validate.component.scss']
})
export class EmailValidateComponent {
  userLogged = userLogged
  private fb = inject(FormBuilder);
  formParent = this.fb.group({
    phone: ['',
      {
        validators:[
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          //Validators.maxLength(13),
          Validators.pattern(`^[\+0-9]+$`)
        ],
        /*
        asyncValidators: [
          this.existWapp.validate.bind(this.existWapp)
        ]
        */
      }
    ],
  });

  isInvalid(fieldname:string){
    const campo = this.formParent.get(fieldname);
    if(campo?.touched){
      //console.log(fieldname,campo?.invalid,campo?.touched,campo?.invalid && campo?.touched);
      //console.log(campo);
      return campo?.invalid && campo?.touched;
    }
    return false;
  }
  confirmar(){
    console.log('confirmar codigo');
  }
  nuevocodigo(){
    console.log('nuevo codigo');
  }

}
