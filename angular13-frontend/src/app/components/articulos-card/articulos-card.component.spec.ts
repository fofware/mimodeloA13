import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticulosCardComponent } from './articulos-card.component';

describe('ArticulosCardComponent', () => {
  let component: ArticulosCardComponent;
  let fixture: ComponentFixture<ArticulosCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticulosCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticulosCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
