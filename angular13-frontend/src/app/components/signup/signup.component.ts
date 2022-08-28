import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public formParent: FormGroup = new FormGroup({});

  constructor() { }

  ngOnInit(): void {
    this.initFormParent()
    this.addSkill();
  }
  initFormParent():void {
    this.formParent = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(10)]),
        skills: new FormArray([], [Validators.required])
      }
    )
  }

  initFormSkill(): FormGroup {
    return new FormGroup(
      {
        email: new FormControl(''),
        celular: new FormControl(''),
        password: new FormControl('', [Validators.required])
      }
    )
  }

  addSkill(): void {
    const refSkills = this.formParent.get('skills') as FormArray;
    refSkills.push(this.initFormSkill())
  }

  getCtrl(key: string, form: FormGroup): any {
    return form.get(key)
  }
}
