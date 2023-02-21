import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloListComponent } from './articulo-list.component';

describe('ArticuloListComponent', () => {
  let component: ArticuloListComponent;
  let fixture: ComponentFixture<ArticuloListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticuloListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
