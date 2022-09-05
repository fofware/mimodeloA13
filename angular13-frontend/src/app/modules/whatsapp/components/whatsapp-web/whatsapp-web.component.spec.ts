import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappWebComponent } from './whatsapp-web.component';

describe('WhatsappWebComponent', () => {
  let component: WhatsappWebComponent;
  let fixture: ComponentFixture<WhatsappWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappWebComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
