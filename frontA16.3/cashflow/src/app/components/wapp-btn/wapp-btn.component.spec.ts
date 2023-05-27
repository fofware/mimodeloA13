import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WappBtnComponent } from './wapp-btn.component';

describe('WappBtnComponent', () => {
  let component: WappBtnComponent;
  let fixture: ComponentFixture<WappBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WappBtnComponent]
    });
    fixture = TestBed.createComponent(WappBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
