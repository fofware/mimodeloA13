import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloFormComponent } from './articulo-form.component';

describe('ArticuloFormComponent', () => {
  let component: ArticuloFormComponent;
  let fixture: ComponentFixture<ArticuloFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticuloFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
