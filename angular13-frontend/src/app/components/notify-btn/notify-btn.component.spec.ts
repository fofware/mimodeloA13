import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyBtnComponent } from './notify-btn.component';

describe('NotifyBtnComponent', () => {
  let component: NotifyBtnComponent;
  let fixture: ComponentFixture<NotifyBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifyBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
