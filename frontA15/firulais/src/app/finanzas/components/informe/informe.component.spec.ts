import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeComponent } from './informe.component';

describe('InformeComponent', () => {
  let component: InformeComponent;
  let fixture: ComponentFixture<InformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InformeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
