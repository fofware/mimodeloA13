import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgPttComponent } from './msg-ptt.component';

describe('MsgPttComponent', () => {
  let component: MsgPttComponent;
  let fixture: ComponentFixture<MsgPttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgPttComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgPttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
