import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedidasComponent } from './medidas.component';

describe('MedidasComponent', () => {
  let component: MedidasComponent;
  let fixture: ComponentFixture<MedidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
