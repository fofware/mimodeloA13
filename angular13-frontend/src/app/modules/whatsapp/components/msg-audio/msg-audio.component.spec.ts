import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgAudioComponent } from './msg-audio.component';

describe('MsgAudioComponent', () => {
  let component: MsgAudioComponent;
  let fixture: ComponentFixture<MsgAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgAudioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
