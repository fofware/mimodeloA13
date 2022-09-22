import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgDocumentComponent } from './msg-document.component';

describe('MsgDocumentComponent', () => {
  let component: MsgDocumentComponent;
  let fixture: ComponentFixture<MsgDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
