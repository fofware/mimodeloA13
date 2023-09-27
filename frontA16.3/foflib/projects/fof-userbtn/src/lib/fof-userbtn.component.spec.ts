import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FofUserbtnComponent } from './fof-userbtn.component';

describe('FofUserbtnComponent', () => {
  let component: FofUserbtnComponent;
  let fixture: ComponentFixture<FofUserbtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FofUserbtnComponent]
    });
    fixture = TestBed.createComponent(FofUserbtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
