import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninBtnComponent } from './signin-btn.component';

describe('SigninBtnComponent', () => {
  let component: SigninBtnComponent;
  let fixture: ComponentFixture<SigninBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigninBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
