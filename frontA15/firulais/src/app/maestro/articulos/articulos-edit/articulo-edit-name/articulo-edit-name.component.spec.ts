import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloEditNameComponent } from './articulo-edit-name.component';

describe('ArticuloEditNameComponent', () => {
  let component: ArticuloEditNameComponent;
  let fixture: ComponentFixture<ArticuloEditNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticuloEditNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloEditNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
