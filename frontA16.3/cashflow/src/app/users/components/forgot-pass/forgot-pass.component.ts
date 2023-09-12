import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, throwError } from 'rxjs';
import { UsersService, userLogged } from '../../services/users.service';
import { Router } from '@angular/router';
import { eMailValidation } from 'src/app/validators/email/email-exists.validator';
import { UniqueMailValidator } from 'src/app/validators/email/unique-mail-validator.directive';
import { WhatsApp, WhatsappService } from 'src/app/validators/whatsapp/whatsapp.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiMsgComponent } from '../modals/api-msg/api-msg.component';
import { ToastService } from 'src/app/services/toast.service';
import { logInUser } from '../../services/interfaces/user';

@Component({
  selector: 'app-forgot-pass',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApiMsgComponent
  ],
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent {
  private regexmail1 = `^[a-z0-9\.]+@([a-z0-9\.]+)+[a-z0-9]{2,4}$`
  //private uniquemail = inject(UniqueMailValidator);
  public wappSvc = inject(WhatsappService);
  private toastr = inject(ToastService);

  modalService = inject(NgbModal)
  wapp:WhatsApp = {isWhatsapp: false}
  sendcode = 0;

  private router = inject(Router);
  private userService = inject(UsersService);
  private destroy$ = new Subject<any>();
  timeOutId:any;

  paso = 0;
  pasos = [
    'Identificación',
    'Paso 1',
    'Generando',
    'Verificar',
    'Validadndo',
    'Cambio de Clave',
    'Grabando nueva Clave'
  ]
  hiddeNext = true;
  showNext = false;

  invalid = 0;
  codecount = 0;

  sendto = 'email'
  private fb = inject(FormBuilder);
  formParent = this.fb.group({
    email: ['',
      {
        validators:[
          Validators.required,
          Validators.pattern(this.regexmail1),
        ],
      }
    ],
    phone: ['',
      {
        validators:[
          Validators.minLength(10),
          Validators.maxLength(14),
          Validators.pattern(`^[\+0-9]+$`)
        ],
      }
    ],
    sender:['email'],
    wapp: [''],
    verify: ['',
      {
        validators:[
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(`^[\+0-9]+$`)
        ]
      }
    ]
  });
  formReset = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    repassword: ['', [Validators.required, eMailValidation.MatchPassword('password')]],
  });

  isInvalid(fieldname:string){
    const campo = this.formParent.get(fieldname);
    //console.log(fieldname);
    /*
    console.log('dirty',campo?.dirty)
    console.log('invalid',campo?.invalid)
    console.log('pending',campo?.pending)
    console.log('pristine',campo?.pristine)
    console.log('status',campo?.status)
    console.log('touched',campo?.touched)
    console.log('untouched',campo?.untouched)
    console.log('valid',campo?.valid)
    console.log('value',campo?.value)
    console.log('formParent.valid',this.formParent.valid)
  */
  //  clearTimeout(this.setTimeOutId);
  //  this.setTimeOutId = setTimeout(this.enableNext, 50);

    this.enableNext();
    if(campo?.touched){
      //console.log(fieldname,campo?.invalid,campo?.touched,campo?.invalid && campo?.touched);
      //console.log(campo);
      return campo?.invalid && campo?.touched;
    }
    return false;
  }

  passIsInvalid(fieldname:string){
    const campo = this.formReset .get(fieldname);
    if(campo?.touched){
      return campo?.invalid && campo?.touched;
    }
    return false;
  }

  enableNext(){
    switch ( this.paso ) {
      case 0:
        //const email = this.formParent.get('email')?.valid || true;
        //const phone = this.formParent.get('phone')?.valid || true;
        this.hiddeNext = !((this.formParent.get('email')?.valid) && (this.formParent.get('phone')?.valid));
        break;
      case 1:
          this.hiddeNext = false;
          //const email = this.formParent.get('email')?.valid || true;
          //const phone = this.formParent.get('phone')?.valid || true;
          break;
      case 2:
        this.hiddeNext = false;

        break
      case 3:
          //this.hiddeNext = !(this.formParent.get('verify')?.valid);
          //this.formParent.get('verify')
          document.getElementById('verify')?.focus();
          //console.log('asdfadfadf',this.showNext);
        break;
      default:
        //this.hiddeNext = true;
        break;
    }
    //console.log('paso', this.paso, 'hiddeNext',this.hiddeNext)
  }

  generaCodigo(){
    try {
      this.userService.newResetPassworCode(this.formParent.value)
      .pipe(
        map( (ret:any) => {
          console.warn(ret);
          if(ret.codigo) {
            this.siguiente();
          } else {
            this.paso = 0;
            this.toastr.warning(ret.message,{header: ret.title})
          }
        }),
      ).subscribe()
    } catch (error) {
      this.paso = 0;
      console.log(error);
    }
  }

  confirmar(){
    console.log(this.formParent.value);
    this.userService.confirmResetPassworCode(this.formParent.value)
    .subscribe((res:any) => {
      console.log(res);
      if(res['codigo']){
        this.toastr.success('Verificado',{delay: 1000, header:'Código de Verificación'})
        this.siguiente();
      } else {
        this.toastr.warning('Inválido, verifique y vuelva a interntarlo',{header:'Código de Verificación'})
        if(this.invalid===3){
          this.invalid = 0;
          this.paso = 0;
          this.formParent.reset();
        } else {
          this.invalid++;
        }
      }
    })
  }

  siguiente(){
    let plus = 0;
    this.hiddeNext = true;
    switch (this.paso) {
      case 0:
        const email = this.formParent.get('email')?.value;
        const phone = this.formParent.get('phone')?.value;
        console.log(this.formParent.value);
        console.log(this.wapp);
        if (!(email && phone && this.wapp.isWhatsapp)) plus = 1;
        break;
      case 1: // selecciona wahatsapp/email
        /**
         * selecciona sender
         */
        console.log('Selecciona donde Envia el código')
        console.log(this.formParent.value);

        break;
      case 2:
        //this.generaCodigo();
        //this.hiddeNext = false;
        //const modalRef = this.modalService.open(ApiMsgComponent);
		    //modalRef.componentInstance.data = this.formParent.value;
        //modalRef.result.then(
        //  (result) => {
        //    //this.closeResult = `Closed with: ${result}`;
        //    console.log(`Closed with: ${result}`);
        //  },
        //  (reason) => {
        //    //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        //    console.log(`Dismissed ${this.getDismissReason(reason)}`);
        //  },)
        break;
      case 5: // espera el codigo
        /**
         * Se envían los datos a la api
         * Recibe true si los datos son validos y se envió el código
         * Recibe false si los datos son iválidos y no se envió el código
         */
        const codigrpta = true;
        if (!codigrpta) this.paso++;
        console.log('Envia el codigo');
        console.log(this.formParent.value);
        break;
      case 3: // Solicita el código de validación
        /**
         * Se validaron los datos en la api y se envió el codigo
         * Se solicita el código
         */

        console.log('Envia el codigo')
        console.log(this.formParent.value);
        break;
      case 6:
        /**
         * Se envía a la api el codigo junto con los datos recopilados
         * @param email
         * @param phone
         * @param verify
         */
        const isverified = false;
        break;
      default:
        break;
    }
    this.paso += 1+plus;
    if(this.paso === 1) this.hiddeNext = false;
    if(this.paso === 2) this.generaCodigo();
    console.log('paso',this.paso, 'hiddeNext', this.hiddeNext)
  }

  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  nuevocodigo(){
    console.log('nuevo código');
    this.paso = 1;
    this.siguiente();
  }

  checkWapp(number:any){
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
          if(value?.user?.number){
            const pn = value.user.number
            this.formParent.patchValue({wapp: pn})
          }
        })
     )
     .subscribe();
  }
  getTitle(){
    let title = '';
    switch (this.paso) {
      case 0:
        title = 'Crear una nueva clave';
        break;
      case 1:
        title = 'Enviar Código a';
        break;
      case 2:
        if(this.sendto === 'email')
          title = `Código enviado a ${this.formParent.get(this.sendto)?.value}`
        else
          title = `Código enviado a<br> ${this.wapp.formatedNumber}`
        break;
        case 3:
          title = 'Verificar Código';
          break;
        case 4:
          title = 'Cambio de Clave';
          break;
        default:
          title = `Titulo ${this.paso}`
        break;
    }
    return title;
  }
  wappExta(number:string){
    this.wappSvc.extraInfo(number)
      .pipe(
        takeUntil(this.destroy$),
        tap(value => console.log(value)),
        map(value => this.wapp = value)
      ).subscribe();
  }

  onSenderClick(ev:any){
    console.log(ev);
    this.sendto = `${this.formParent.value?.sender}`;
    console.log('onSenderClick()', this.sendto);
  }
  writenewpasswor(){
    const data:logInUser = {
      email: <string>this.formParent.value.email,
      password: <string>this.formReset.value.password
    }
    this.userService.savePassword(data).subscribe( (res:any) => {
      this.userService.processToken(res.token)
      this.toastr.success('Se cambió la clave exitosamente',{delay: 2000, header:'Nueva Clave'})
      this.router.navigate(['users'])
    })

  }
  open( content: any){
    this.modalService.open(content, { centered: true, fullscreen: true, scrollable: true })
  }
}
