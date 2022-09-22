import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgImageComponent } from './msg-image.component';

describe('MsgImageComponent', () => {
  let component: MsgImageComponent;
  let fixture: ComponentFixture<MsgImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
