import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloCardComponent } from './articulo-card.component';

describe('ArticuloCardComponent', () => {
  let component: ArticuloCardComponent;
  let fixture: ComponentFixture<ArticuloCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticuloCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
