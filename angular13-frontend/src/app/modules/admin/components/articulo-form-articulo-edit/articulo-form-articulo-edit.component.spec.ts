import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloFormArticuloEditComponent } from './articulo-form-articulo-edit.component';

describe('ArticuloFormArticuloEditComponent', () => {
  let component: ArticuloFormArticuloEditComponent;
  let fixture: ComponentFixture<ArticuloFormArticuloEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticuloFormArticuloEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloFormArticuloEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
