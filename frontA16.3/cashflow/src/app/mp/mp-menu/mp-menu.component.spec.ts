import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpMenuComponent } from './mp-menu.component';

describe('MpMenuComponent', () => {
  let component: MpMenuComponent;
  let fixture: ComponentFixture<MpMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MpMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
