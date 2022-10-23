import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionesFormEditComponent } from './presentaciones-form-edit.component';

describe('PresentacionesFormEditComponent', () => {
  let component: PresentacionesFormEditComponent;
  let fixture: ComponentFixture<PresentacionesFormEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentacionesFormEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentacionesFormEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
