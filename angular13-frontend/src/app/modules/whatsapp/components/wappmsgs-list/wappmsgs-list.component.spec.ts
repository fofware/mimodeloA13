import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WappmsgsListComponent } from './wappmsgs-list.component';

describe('WappmsgsListComponent', () => {
  let component: WappmsgsListComponent;
  let fixture: ComponentFixture<WappmsgsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WappmsgsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WappmsgsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
