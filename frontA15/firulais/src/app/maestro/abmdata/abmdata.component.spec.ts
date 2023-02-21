import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmdataComponent } from './abmdata.component';

describe('AbmdataComponent', () => {
  let component: AbmdataComponent;
  let fixture: ComponentFixture<AbmdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AbmdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
