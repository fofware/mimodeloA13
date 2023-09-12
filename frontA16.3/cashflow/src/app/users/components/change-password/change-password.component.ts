import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService, userLogged } from '../../services/users.service';
import { Router } from '@angular/router';
import { eMailValidation } from 'src/app/validators/email/email-exists.validator';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnDestroy{
  private destroy$ = new Subject<any>();
  private fb = inject(FormBuilder);
  private userService = inject(UsersService);
  private router = inject(Router);
  formParent = this.fb.group({
    oldpassword: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repassword: ['', [Validators.required, eMailValidation.MatchPassword('password')]],
  });

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  enviar(){
    this.userService.cambiarClave(this.formParent.value)
    .pipe(takeUntil(this.destroy$))
    .subscribe(async (data:any) => {
      console.log("cambiaClave",data);
      await this.userService.processToken(data.token);
      this.router.navigate(['/users']);
    });
  }

  isInvalid(fieldname:string){
    const campo = this.formParent.get(fieldname);
    if(campo?.touched){
      //console.log(fieldname,campo?.invalid,campo?.touched,campo?.invalid && campo?.touched);
      //console.log(campo);
      return campo?.invalid && campo?.touched;
    }
    return false;
  }
  get _loggedUser(){
    return userLogged;
  }

}
