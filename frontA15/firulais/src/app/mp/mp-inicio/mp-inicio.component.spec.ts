import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpInicioComponent } from './mp-inicio.component';

describe('MpInicioComponent', () => {
  let component: MpInicioComponent;
  let fixture: ComponentFixture<MpInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MpInicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
