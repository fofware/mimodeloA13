import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsortComponent } from './testsort.component';

describe('TestsortComponent', () => {
  let component: TestsortComponent;
  let fixture: ComponentFixture<TestsortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsortComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
