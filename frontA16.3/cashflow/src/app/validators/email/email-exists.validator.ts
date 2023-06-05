import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsersService } from '../../users/services/users.service';
import { Observable, of } from 'rxjs';
//import { UsersService } from '../../services/users.service';

import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export class PasswordValidation {
  static MatchPassword(name: string) {
    return (AC: AbstractControl) => {
      const formGroup = AC.parent;
      if (formGroup) {
        const passwordControl = formGroup.get(name);
        const confirmPasswordControl = AC;
        if (passwordControl && confirmPasswordControl) {
          const password = passwordControl.value;
          const confirmPassword = confirmPasswordControl.value;
          if (password !== confirmPassword) {
            return { matchPassword: true };
          } else {
            return null;
          }
        }
      }
      return null;
    }
  }
}

export class eMailValidation {
  static MatchPassword(name: string) {
    return (AC: AbstractControl) => {
      const formGroup = AC.parent;
      if (formGroup) {
        const passwordControl = formGroup.get(name);
        const confirmPasswordControl = AC;
        if (passwordControl && confirmPasswordControl) {
          const password = passwordControl.value;
          const confirmPassword = confirmPasswordControl.value;
          if (password !== confirmPassword) {
            return { matchPassword: true };
          } else {
            return null;
          }
        }
      }
      return null;
    }
  }
  static exist(service:UsersService) {
    return async (AC: AbstractControl): Promise<Observable<ValidationErrors> | null>  => {
      if(AC.value){
        const ret = await service.emailExists(AC.value);
        console.log(ret);
        //if (ret) return of({email: true})
        return null;
      } else return null;
    }
  }
  static other(service:UsersService) {
    return async (AC: AbstractControl) => {
      return service.emailFind(AC.value).pipe(
        map( isTaken => {
          console.log(isTaken);
          ( isTaken ? { emaiExists: true} : null)
        })
      )
    }
  }
}

/*
export class UsernameValidator {
  static createValidator(userService: UsersService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return userService.emailFind(control.value).pipe(map( (x:boolean) => x ? { exists : true} : null))
    };
  }
}
*/

//export async function correo(
//  control: AbstractControl )  {
//  const http = new HttpClient()
//  if (control.value) {
//    const ret = await service.mailExist(control.value);
//    console.log(ret);
//    if (ret) return {email: true}
//    return null;
//  }
//  return null;
//}

export function AgeValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (control.value > 18) {
    return { age: true };
  }
  return null;
}

export function emailAllreadyExist(
  control: AbstractControl, UsersService: UsersService
): { [key: string]: boolean } | null {
  let ret = null;
  const value = UsersService.emailFind(control.value).subscribe((data:any) =>{
    console.log(value)
  })
  return ret;
}

//
//export function userEmailExistsValidator(user: UsersService):AsyncValidatorFn  {
//    return (control: AbstractControl) => {
//        return user.findUserByEmail(control.value)
//    }
//}
//

/*
export function existingEmailNumberValidator(userService: UsersService): AsyncValidatorFn {
  return async (control: AbstractControl): Promise<Promise<ValidationErrors | null> | Observable<ValidationErrors | null>> => {
    return (await userService.emailFind(control.value)).map(
      users => {
        console.log(users);
        return (users && users.length > 0) ? {"eMailExists": true} : null;
      }
    );
  };
}
*/
