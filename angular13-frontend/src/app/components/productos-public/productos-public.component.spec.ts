import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosPublicComponent } from './productos-public.component';

describe('ProductosPublicComponent', () => {
  let component: ProductosPublicComponent;
  let fixture: ComponentFixture<ProductosPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
