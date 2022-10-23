import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionesComponent } from './presentaciones.component';

describe('PresentacionesComponent', () => {
  let component: PresentacionesComponent;
  let fixture: ComponentFixture<PresentacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
