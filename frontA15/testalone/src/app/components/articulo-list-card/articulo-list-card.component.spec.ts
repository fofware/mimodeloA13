import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloListCardComponent } from './articulo-list-card.component';

describe('ArticuloListCardComponent', () => {
  let component: ArticuloListCardComponent;
  let fixture: ComponentFixture<ArticuloListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticuloListCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
