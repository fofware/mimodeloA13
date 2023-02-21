import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloEditPresentacionesComponent } from './articulo-edit-presentaciones.component';

describe('ArticuloEditPresentacionesComponent', () => {
  let component: ArticuloEditPresentacionesComponent;
  let fixture: ComponentFixture<ArticuloEditPresentacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticuloEditPresentacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloEditPresentacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
