import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WappchatsListComponent } from './wappchats-list.component';

describe('WappchatsListComponent', () => {
  let component: WappchatsListComponent;
  let fixture: ComponentFixture<WappchatsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WappchatsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WappchatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
