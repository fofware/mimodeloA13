import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroComponent } from './maestro.component';

describe('MaestroComponent', () => {
  let component: MaestroComponent;
  let fixture: ComponentFixture<MaestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MaestroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
