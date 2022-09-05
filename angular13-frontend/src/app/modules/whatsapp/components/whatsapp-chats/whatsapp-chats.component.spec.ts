import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappChatsComponent } from './whatsapp-chats.component';

describe('WhatsappChatsComponent', () => {
  let component: WhatsappChatsComponent;
  let fixture: ComponentFixture<WhatsappChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappChatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
