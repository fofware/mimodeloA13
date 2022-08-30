import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormhijosComponent } from './formhijos.component';

describe('FormhijosComponent', () => {
  let component: FormhijosComponent;
  let fixture: ComponentFixture<FormhijosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormhijosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormhijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
