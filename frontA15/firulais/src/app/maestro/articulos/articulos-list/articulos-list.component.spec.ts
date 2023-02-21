import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticulosListComponent } from './articulos-list.component';

describe('ArticulosListComponent', () => {
  let component: ArticulosListComponent;
  let fixture: ComponentFixture<ArticulosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticulosListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticulosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
