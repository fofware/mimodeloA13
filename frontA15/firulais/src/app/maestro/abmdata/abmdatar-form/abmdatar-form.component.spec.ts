import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmdatarFormComponent } from './abmdatar-form.component';

describe('AbmdatarFormComponent', () => {
  let component: AbmdatarFormComponent;
  let fixture: ComponentFixture<AbmdatarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AbmdatarFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmdatarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
