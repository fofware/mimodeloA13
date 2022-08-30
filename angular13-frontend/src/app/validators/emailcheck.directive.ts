import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appEmailcheck]',
  providers: [
    {
        provide: NG_ASYNC_VALIDATORS, 
        useExisting: forwardRef(() => EmailcheckDirective), 
        multi: true
    }
  ]
})

export class EmailcheckDirective  implements AsyncValidator {

  constructor(private accountService : AuthService) {
  }
  
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.accountService.emailFind(control.value).pipe(map( (x:any) => x.exists ? { exists : true} : null))
  }

}
