import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgStickerComponent } from './msg-sticker.component';

describe('MsgStickerComponent', () => {
  let component: MsgStickerComponent;
  let fixture: ComponentFixture<MsgStickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgStickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgStickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
