import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloEditDataComponent } from './articulo-edit-data.component';

describe('ArticuloEditDataComponent', () => {
  let component: ArticuloEditDataComponent;
  let fixture: ComponentFixture<ArticuloEditDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticuloEditDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloEditDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
