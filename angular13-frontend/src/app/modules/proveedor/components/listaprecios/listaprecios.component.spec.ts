import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListapreciosComponent } from './listaprecios.component';

describe('ListapreciosComponent', () => {
  let component: ListapreciosComponent;
  let fixture: ComponentFixture<ListapreciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListapreciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListapreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
