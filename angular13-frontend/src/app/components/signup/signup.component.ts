import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
//import { existingEmailNumberValidator } from 'src/app/validators/email-exists.validator';
import { AgeValidator, emailAllreadyExist, eMailValidation, PasswordValidation } from 'src/app/validators/email-exists.validator';
import { TestValidator } from 'src/app/validators/test-validator.directive';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
/**
 * https://stackoverflow.com/questions/68628029/implement-async-validator-on-angular-formcontrol
 * https://upmostly.com/angular/async-validators-in-angular
 *
 */
export class SignupComponent implements OnInit {
  regexmail =  '^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$';
  regexmail1 = `^[a-z0-9\.]+@([a-z0-9\.]+)+[a-z0-9]{2,4}$`
  formParent = this.fb.group({
    //name: ['', 
    //  [
    //    Validators.required,
    //    Validators.minLength(3)
    //  ]],
//    email: ['',[Validators.pattern(`^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`)]],
    email: ['',
      //[
      //  Validators.required,
      //  Validators.pattern(this.regexmail1),
      //  
      //],
      {
        validators:[
          Validators.required,
          Validators.pattern(this.regexmail1) 
        ],
        asyncValidators: [this.alterEgoValidator.validate.bind(this.alterEgoValidator)],
        updateOn: 'blur'
      }
      //[
      //  eMailValidation.other(this.authService)
      //]
    ],
    //email: ['',
    //  {
    //    validators:
    //    [
    //      Validators.pattern(`^[a-z0-9\.]+@([a-z0-9\.]+)+[a-z0-9]{2,4}$`),
    //    ],
    //    updateOn: 'blur'
    //  },
    //  [
    //    eMailValidation.other(this.authService)
    //  ]
    //],
    //celular: ['',[null,Validators.compose([null,Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]+')])]],
    //celular: ['',[Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]+')]],
    //edad: ['',[AgeValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repassword: ['', [Validators.required, eMailValidation.MatchPassword('password')]]
  })
  constructor(private fb: FormBuilder, private authService: AuthService, private alterEgoValidator: TestValidator) { }

  ngOnInit(): void {
  }
  ngAfterViewInit():void{
    //this.SetDefault();
  }
  checkEmail(){
    const values = this.formParent.value;
    console.log(values)
    //if(values.email)
    //  this.authService.emailFind(values.email).pipe(map())
  }
  enviar(){
    console.log("Envia", this.formParent.value);
    
  }

  isInvalid(fieldname:string){
    const campo = this.formParent.get(fieldname);
    return campo?.invalid && campo?.touched;
  }


  SetDefault(){
    const contact = {
      name: '',
      email: '',
      celular: '',
      password: '',
      repassword: ''
    }
    this.formParent.setValue(contact);
  }

  resetForm():void{
    this.formParent.reset();
  }
}
function existingEmailNumberValidato(authService: any): any | string {
  throw new Error('Function not implemented.');
}

