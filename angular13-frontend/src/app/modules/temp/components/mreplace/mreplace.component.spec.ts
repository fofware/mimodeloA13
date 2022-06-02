import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MreplaceComponent } from './mreplace.component';

describe('MreplaceComponent', () => {
  let component: MreplaceComponent;
  let fixture: ComponentFixture<MreplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MreplaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MreplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
