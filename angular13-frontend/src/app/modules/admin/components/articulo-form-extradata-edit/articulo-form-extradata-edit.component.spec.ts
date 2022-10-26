import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloFormExtradataEditComponent } from './articulo-form-extradata-edit.component';

describe('ArticuloFormExtradataEditComponent', () => {
  let component: ArticuloFormExtradataEditComponent;
  let fixture: ComponentFixture<ArticuloFormExtradataEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticuloFormExtradataEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloFormExtradataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
