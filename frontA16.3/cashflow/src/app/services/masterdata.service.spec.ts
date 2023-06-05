import { TestBed } from '@angular/core/testing';

import { MasterdataService } from './masterdata.service';

describe('MasterdataService', () => {
  let service: MasterdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
