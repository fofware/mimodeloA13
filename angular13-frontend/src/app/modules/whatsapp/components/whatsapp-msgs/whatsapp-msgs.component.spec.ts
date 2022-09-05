import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappMsgsComponent } from './whatsapp-msgs.component';

describe('WhatsappMsgsComponent', () => {
  let component: WhatsappMsgsComponent;
  let fixture: ComponentFixture<WhatsappMsgsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappMsgsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappMsgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
