import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappContactosComponent } from './whatsapp-contactos.component';

describe('WhatsappContactosComponent', () => {
  let component: WhatsappContactosComponent;
  let fixture: ComponentFixture<WhatsappContactosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappContactosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappContactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
