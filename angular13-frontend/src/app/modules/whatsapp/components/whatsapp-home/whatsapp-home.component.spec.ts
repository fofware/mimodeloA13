import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappHomeComponent } from './whatsapp-home.component';

describe('WhatsappHomeComponent', () => {
  let component: WhatsappHomeComponent;
  let fixture: ComponentFixture<WhatsappHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
