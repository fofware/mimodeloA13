import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaComponent } from './linea.component';

describe('LineaComponent', () => {
  let component: LineaComponent;
  let fixture: ComponentFixture<LineaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
