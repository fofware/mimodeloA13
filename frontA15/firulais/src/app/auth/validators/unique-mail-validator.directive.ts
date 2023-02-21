import { Directive, forwardRef, inject, Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  NG_ASYNC_VALIDATORS,
  ValidationErrors
} from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { CheckeMailService } from './checkemail.service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UniqueMailValidator implements AsyncValidator {
  checkeMailSrv = inject(CheckeMailService)
  //constructor() {}
  validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {

    return this.checkeMailSrv.emailFind(control.value).pipe(
      map(isTaken => (isTaken ? { uniqueMail: true } : null)),
      catchError(() => of(null))
    );
  }
}

@Directive({
  selector: '[appUniqueMail]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => uniqueMailValidatorDirective),
      multi: true
    }
  ]
})
export class uniqueMailValidatorDirective implements AsyncValidator {
  constructor(private validator: UniqueMailValidator) {}

  validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this.validator.validate(control);
  }
}
