import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-menues',
  templateUrl: './menues.component.html',
  styleUrls: ['./menues.component.css']
})
export class MenuesComponent implements OnInit {

  public menuParent: FormGroup = new FormGroup({});

  constructor() { }

  ngOnInit(): void {
    this.initMenuParent()
    this.addSkill();
  }
  initMenuParent():void {
    this.menuParent = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(10)]),
        group: new FormControl('', [Validators.required]),
        childMenu: new FormArray([], [Validators.required])
      }
    )
  }

  initFormChildsMenu(): FormGroup {
    return new FormGroup(
      {
        email: new FormControl(''),
        celular: new FormControl(''),
        password: new FormControl('', [Validators.required])
      }
    )
  }

  addSkill(): void {
    const refSkills = this.menuParent.get('skills') as FormArray;
    refSkills.push(this.initFormChildsMenu());
  }

  getCtrl(key: string, form: FormGroup): any {
    return form.get(key);
  }

}
