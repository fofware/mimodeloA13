import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticulosSortableNameComponent } from './articulos-sortable-name.component';

describe('ArticulosSortableNameComponent', () => {
  let component: ArticulosSortableNameComponent;
  let fixture: ComponentFixture<ArticulosSortableNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticulosSortableNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticulosSortableNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
