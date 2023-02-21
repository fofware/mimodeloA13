import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsAppDashboardComponent } from './whats-app-dashboard.component';

describe('WhatsAppDashboardComponent', () => {
  let component: WhatsAppDashboardComponent;
  let fixture: ComponentFixture<WhatsAppDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WhatsAppDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsAppDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
