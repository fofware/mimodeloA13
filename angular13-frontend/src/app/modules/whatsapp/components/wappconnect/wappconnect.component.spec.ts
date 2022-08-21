import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WappconnectComponent } from './wappconnect.component';

describe('WappconnectComponent', () => {
  let component: WappconnectComponent;
  let fixture: ComponentFixture<WappconnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WappconnectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WappconnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
