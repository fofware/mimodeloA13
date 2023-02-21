import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmdataCardComponent } from './abmdata-card.component';

describe('AbmdataCardComponent', () => {
  let component: AbmdataCardComponent;
  let fixture: ComponentFixture<AbmdataCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AbmdataCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmdataCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
