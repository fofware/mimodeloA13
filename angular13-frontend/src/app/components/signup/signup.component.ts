import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AgeValidator, emailAllreadyExist, eMailValidation, PasswordValidation } from 'src/app/validators/email-exists.validator';
import { TestValidator } from 'src/app/validators/test-validator.directive';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Router } from '@angular/router';
import { Subject, takeUntil, timeout } from 'rxjs';

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
    nombre: ['',
      [
        Validators.required,
        Validators.minLength(3)
      ]],
    apellido: [''],
    email: ['',
      {
        validators:[
          Validators.required,
          Validators.pattern(this.regexmail1)
        ],
        asyncValidators: [this.alterEgoValidator.validate.bind(this.alterEgoValidator)],
        updateOn: 'blur'
      }
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repassword: ['', [Validators.required, eMailValidation.MatchPassword('password')]],
    phone: ['',[Validators.minLength(10), Validators.maxLength(10), Validators.pattern(`^[0-9]+$`)]],
    captcha: ['', []]
  });
  private destroy$ = new Subject<any>();
  captchaResolved = false;

  constructor(
    private fb: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private authService: AuthService,
    private alterEgoValidator: TestValidator,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOndestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }
  /*
  ngAfterViewInit():void{
    //this.SetDefault();
  }

  checkEmail(){
    const values = this.formParent.value;
    console.log(values)
    //if(values.email)
    //  this.authService.emailFind(values.email).pipe(map())
  }
  */
  enviar(){
    this.recaptchaV3Service
      .execute('registerCustomer')
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: string) => {
        console.log(`Token [${token}] generated`);
        this.formParent.patchValue({'captcha': token})
        console.log("Envia", this.formParent.value);
        this.authService.signUp(this.formParent.value).subscribe(data => {
          console.log(data)
          const user = {
            email: this.formParent.value.email,
            password: this.formParent.value.password,
            nombre: this.formParent.value.nombre,
            apellido: this.formParent.value.apellido,
            phone: this.formParent.value.phone
          }
          this.authService.signIn(user).subscribe(res => {
            //setTimeout(function(){
              this.router.navigate(['/user/profile']);
            //}, 2000);
          })
        })
    });
  }

  isInvalid(fieldname:string){
    const campo = this.formParent.get(fieldname);
    return campo?.invalid && campo?.touched;
  }

  /*
  SetDefault(){
    const contact = {
      name: '',
      email: '',
      celular: '',
      password: '',
      repassword: '',
      //captcha: null
    }
    this.formParent.setValue(contact);
  }

  resetForm():void{
    this.formParent.reset();
  }

  checkCaptcha(captchaResponse : any) {
    console.log(captchaResponse)
    this.captchaResolved = (captchaResponse && captchaResponse.length > 0) ? true : false
  }
  */
}

