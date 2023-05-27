import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPageComponent } from './no-page.component';

describe('NoPageComponent', () => {
  let component: NoPageComponent;
  let fixture: ComponentFixture<NoPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoPageComponent]
    });
    fixture = TestBed.createComponent(NoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
