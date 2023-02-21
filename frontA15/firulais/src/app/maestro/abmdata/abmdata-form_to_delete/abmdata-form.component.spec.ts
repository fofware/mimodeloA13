import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmdataFormComponent } from './abmdata-form.component';

describe('AbmdataFormComponent', () => {
  let component: AbmdataFormComponent;
  let fixture: ComponentFixture<AbmdataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AbmdataFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmdataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
