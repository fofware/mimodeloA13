import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PMenuComponent } from './p-menu.component';

describe('PMenuComponent', () => {
  let component: PMenuComponent;
  let fixture: ComponentFixture<PMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PMenuComponent]
    });
    fixture = TestBed.createComponent(PMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
