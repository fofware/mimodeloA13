import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloEditPresentacionesFormComponent } from './articulo-edit-presentaciones-form.component';

describe('ArticuloEditPresentacionesFormComponent', () => {
  let component: ArticuloEditPresentacionesFormComponent;
  let fixture: ComponentFixture<ArticuloEditPresentacionesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticuloEditPresentacionesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloEditPresentacionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
