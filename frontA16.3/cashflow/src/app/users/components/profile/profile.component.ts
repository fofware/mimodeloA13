import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { WhatsApp, WhatsappService } from 'src/app/validators/whatsapp/whatsapp.service';
import { Router } from '@angular/router';
import { existWhatsAppValidator } from 'src/app/validators/whatsapp/whatsapp-exist.directive';
import { UsersService } from '../../services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  regexmail =  '^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$';
  regexmail1 = `^[a-z0-9\.]+@([a-z0-9\.]+)+[a-z0-9]{2,4}$`
  private destroy$ = new Subject<any>();
  //captchaResolved = false;
  private fb = inject(FormBuilder);
  //private recaptchaV3Service = inject(ReCaptchaV3Service);
  private userService = inject(UsersService);
  private existWapp = inject(existWhatsAppValidator);
  public wappSvc = inject(WhatsappService);
  private router = inject(Router);
  modalService = inject(NgbModal)
  isWapp = false;
  wappPic = ''
  wapp:WhatsApp = {isWhatsapp: false}
  formParent = this.fb.group({
    /*
    nombre: ['',
      [
        Validators.required,
        Validators.minLength(3)
      ]],
    apellido: [''],
    */
    phone: ['',
      {
        validators:[
          Validators.minLength(10),
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

  //constructor() { }

  checkWapp(number:any){
    console.log('CheckWapp',this.formParent.value.phone);
    const sphone = `${this.formParent.value.phone}`;
    if(sphone.length<10) return;
    this.wappSvc.exist(sphone)
      .pipe(
        takeUntil(this.destroy$),
        tap(value => console.log(value)),
        map(value => {
          this.wapp = value;
          if(value.user?.number)
            this.wappExta(value.user?.number);
        })
     )
     .subscribe();
  }

  wappExta(number:string){
    this.wappSvc.extraInfo(number)
      .pipe(
        takeUntil(this.destroy$),
        tap(value => console.log(value)),
        map(value => this.wapp = value)
      ).subscribe();
  }

  open( content: any){
    this.modalService.open(content, { centered: true, fullscreen: true, scrollable: true })
  }

  ngOndestroy(){
    this.destroy$.next({});
    this.destroy$.complete();
  }

//  ngAfterViewInit():void{
//    setTimeout(() => {
//      // turn off any input field
//      document.querySelectorAll('input').forEach((element) => {
//        element.setAttribute('autocomplete', 'off');
//      });
//      document.querySelectorAll('textarea').forEach((element) => element.setAttribute('autocomplete', 'off'));
//
//      // this code disable address fields
//      /*
//      document.querySelector('#address-form-google-search').setAttribute('autocomplete', 'nope');
//      if (/Edg/.test(navigator.userAgent)) {
//        this.setAddressFields('additional-name');
//      } else {
//        this.setAddressFields('nope');
//      }
//
//      // other fields may still save the information by looking at name, here we randomize the name
//      const random = Math.random();
//      document.querySelectorAll('input').forEach((element) => {
//        if (element.id !== 'address-form-google-search') {
//          element.setAttribute('name', element.name + '_' + random);
//        }
//      });
//      */
//    }, 500);
//  }
/*
  checkEmail(){
    const values = this.formParent.value;
    console.log(values)
    //if(values.email)
    //  this.userService.emailFind(values.email).pipe(map())
  }
  */

  enviar(){
    /*
    this.userService.signUp(this.formParent.value)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any) => {
      console.log(data);
      this.userService.processToken(data.token);
      this.router.navigate(['/users']);
    });
    */
  }

  /*
  enviar1(){
    this.recaptchaV3Service
      .execute('registerCustomer')
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: string) => {
        console.log(`Token [${token}] generated`);
        this.formParent.patchValue({'captcha': token})
        console.log("Envia", this.formParent.value);
        this.userService.signUp(this.formParent.value).subscribe((data:any) => {
          console.log(data);
          //const tocken = data.token
          this.userService.processToken(data.token);
          this.router.navigate(['/users']);

        })
    });
  }
*/
  isInvalid(fieldname:string){
    const campo = this.formParent.get(fieldname);
    if(campo?.touched){
      //console.log(fieldname,campo?.invalid,campo?.touched,campo?.invalid && campo?.touched);
      //console.log(campo);
      return campo?.invalid && campo?.touched;
    }
    return false;
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
