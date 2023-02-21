import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideArticuloCardComponent } from './slide-articulo-card.component';

describe('SlideArticuloCardComponent', () => {
  let component: SlideArticuloCardComponent;
  let fixture: ComponentFixture<SlideArticuloCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SlideArticuloCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideArticuloCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
