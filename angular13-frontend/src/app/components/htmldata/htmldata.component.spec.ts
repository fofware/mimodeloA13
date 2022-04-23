import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmldataComponent } from './htmldata.component';

describe('HtmldataComponent', () => {
  let component: HtmldataComponent;
  let fixture: ComponentFixture<HtmldataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmldataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
