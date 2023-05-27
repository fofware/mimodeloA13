import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertBtnComponent } from './alert-btn.component';

describe('AlertBtnComponent', () => {
  let component: AlertBtnComponent;
  let fixture: ComponentFixture<AlertBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlertBtnComponent]
    });
    fixture = TestBed.createComponent(AlertBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
