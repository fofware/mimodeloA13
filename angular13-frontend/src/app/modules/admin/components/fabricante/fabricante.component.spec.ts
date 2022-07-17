import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricanteComponent } from './fabricante.component';

describe('FabricanteComponent', () => {
  let component: FabricanteComponent;
  let fixture: ComponentFixture<FabricanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabricanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
