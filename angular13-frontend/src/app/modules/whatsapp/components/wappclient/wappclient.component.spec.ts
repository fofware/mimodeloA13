import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WappclientComponent } from './wappclient.component';

describe('WappclientComponent', () => {
  let component: WappclientComponent;
  let fixture: ComponentFixture<WappclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WappclientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WappclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
