import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdToastComponent } from './ngbd-toast.component';

describe('NgbdToastComponent', () => {
  let component: NgbdToastComponent;
  let fixture: ComponentFixture<NgbdToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NgbdToastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgbdToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
