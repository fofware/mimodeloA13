import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticulosPublicComponent } from './articulos-public.component';

describe('ArticulosPublicComponent', () => {
  let component: ArticulosPublicComponent;
  let fixture: ComponentFixture<ArticulosPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticulosPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticulosPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
