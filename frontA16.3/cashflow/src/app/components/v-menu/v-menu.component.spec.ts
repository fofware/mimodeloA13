import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VMenuComponent } from './v-menu.component';

describe('VMenuComponent', () => {
  let component: VMenuComponent;
  let fixture: ComponentFixture<VMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ VMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
