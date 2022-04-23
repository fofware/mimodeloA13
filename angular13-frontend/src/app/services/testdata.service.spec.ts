import { TestBed } from '@angular/core/testing';

import { TestdataService } from './testdata.service';

describe('TestdataService', () => {
  let service: TestdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
