import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HMenuComponent } from './h-menu.component';

describe('HMenuComponent', () => {
  let component: HMenuComponent;
  let fixture: ComponentFixture<HMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HMenuComponent]
    });
    fixture = TestBed.createComponent(HMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
