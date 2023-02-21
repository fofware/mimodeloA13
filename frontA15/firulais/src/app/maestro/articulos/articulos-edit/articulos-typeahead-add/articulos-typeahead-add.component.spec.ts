import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticulosTypeaheadAddComponent } from './articulos-typeahead-add.component';

describe('ArticulosTypeaheadAddComponent', () => {
  let component: ArticulosTypeaheadAddComponent;
  let fixture: ComponentFixture<ArticulosTypeaheadAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticulosTypeaheadAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticulosTypeaheadAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
