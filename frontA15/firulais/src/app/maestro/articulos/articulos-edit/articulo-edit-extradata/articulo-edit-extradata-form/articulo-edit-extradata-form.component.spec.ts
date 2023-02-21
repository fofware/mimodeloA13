import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloEditExtradataFormComponent } from './articulo-edit-extradata-form.component';

describe('ArticuloEditExtradataFormComponent', () => {
  let component: ArticuloEditExtradataFormComponent;
  let fixture: ComponentFixture<ArticuloEditExtradataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticuloEditExtradataFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloEditExtradataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
