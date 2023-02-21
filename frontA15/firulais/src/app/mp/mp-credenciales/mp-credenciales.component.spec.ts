import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpCredencialesComponent } from './mp-credenciales.component';

describe('MpCredencialesComponent', () => {
  let component: MpCredencialesComponent;
  let fixture: ComponentFixture<MpCredencialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MpCredencialesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpCredencialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
