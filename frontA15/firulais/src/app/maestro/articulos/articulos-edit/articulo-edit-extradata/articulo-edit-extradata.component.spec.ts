import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloEditExtradataComponent } from './articulo-edit-extradata.component';

describe('ArticuloEditExtradataComponent', () => {
  let component: ArticuloEditExtradataComponent;
  let fixture: ComponentFixture<ArticuloEditExtradataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ArticuloEditExtradataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloEditExtradataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
