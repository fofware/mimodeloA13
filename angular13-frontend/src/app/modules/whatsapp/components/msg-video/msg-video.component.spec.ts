import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgVideoComponent } from './msg-video.component';

describe('MsgVideoComponent', () => {
  let component: MsgVideoComponent;
  let fixture: ComponentFixture<MsgVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
