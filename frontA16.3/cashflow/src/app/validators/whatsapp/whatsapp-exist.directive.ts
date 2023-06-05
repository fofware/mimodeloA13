import { Directive, Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { WhatsappService } from './whatsapp.service';

@Injectable({ providedIn: 'root' })
export class existWhatsAppValidator implements AsyncValidator {
  checkWhatsApplSrv = inject(WhatsappService)
  //constructor() {}
  validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {

    return this.checkWhatsApplSrv.exist(control.value).pipe(
      map(isTaken => (isTaken)),
      catchError(() => of(null))
    );
  }
}

@Directive({
  selector: '[appWhatsappExist]',
  standalone: true
})
export class WhatsappExistDirective {

  constructor() { }

}

export class existWhatsAppValidatorDirective implements AsyncValidator {
  constructor(private validator: existWhatsAppValidator) {}

  validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this.validator.validate(control);
  }
}
