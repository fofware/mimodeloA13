import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasPreciosNavComponent } from './listas-precios-nav.component';

describe('ListasPreciosNavComponent', () => {
  let component: ListasPreciosNavComponent;
  let fixture: ComponentFixture<ListasPreciosNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListasPreciosNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListasPreciosNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
