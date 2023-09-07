import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService, userLogged } from '../../services/users.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
//import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-email-validate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
//    RecaptchaV3Module
  ],
  templateUrl: './email-validate.component.html',
  styleUrls: ['./email-validate.component.scss']
})
export class EmailValidateComponent {
  userLogged = userLogged
//  private recaptchaV3Service = inject(ReCaptchaV3Service);
  private router = inject(Router);
  private userService = inject(UsersService);
  private destroy$ = new Subject<any>();

  private fb = inject(FormBuilder);
  formParent = this.fb.group({
    verify: ['',
      {
        validators:[
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(`^[\+0-9]+$`)
        ],
        /*
        asyncValidators: [
          this.existWapp.validate.bind(this.existWapp)
        ]
        */
      }
    ],
    captcha: ['', []]
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
    this.userService.confirmEmail(this.formParent.value)
    .pipe(takeUntil(this.destroy$))
    .subscribe(async (data:any) => {
      await this.userService.processToken(data.token);

      console.log(data);
      if(data.verify)
        this.router.navigate(['/users'])
        .then( rt => window.location.reload());
    });
  }

/*
  confirmar1(){
    this.recaptchaV3Service
      .execute('confirmCustomer')
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: string) => {
        console.log(`Token [${token}] generated`);
        this.formParent.patchValue({'captcha': token})
        console.log("Confirmar", this.formParent.value);
        this.userService.confirmEmail(this.formParent.value)
        .subscribe(async (data:any) => {
          await this.userService.processToken(data.token);

          console.log(data);
          if(data.verify)
            this.router.navigate(['/users'])
            .then( rt => window.location.reload());
          //const tocken = data.token
          //this.userService.processToken(data.token);
          //this.router.navigate(['/users']);

        })
    });
  }
*/
  nuevocodigo(){
    console.log('nuevo código')
    this.userService.newConfirmEmail()
    .subscribe();
  }

}
