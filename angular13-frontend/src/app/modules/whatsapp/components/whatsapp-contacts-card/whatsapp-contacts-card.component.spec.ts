import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappContactsCardComponent } from './whatsapp-contacts-card.component';

describe('WhatsappContactsCardComponent', () => {
  let component: WhatsappContactsCardComponent;
  let fixture: ComponentFixture<WhatsappContactsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappContactsCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappContactsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
