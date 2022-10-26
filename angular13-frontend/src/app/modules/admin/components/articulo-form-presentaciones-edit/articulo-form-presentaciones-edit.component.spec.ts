import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloFormPresentacionesEditComponent } from './articulo-form-presentaciones-edit.component';

describe('ArticuloFormPresentacionesEditComponent', () => {
  let component: ArticuloFormPresentacionesEditComponent;
  let fixture: ComponentFixture<ArticuloFormPresentacionesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticuloFormPresentacionesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloFormPresentacionesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
