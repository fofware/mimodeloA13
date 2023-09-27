import { TestBed } from '@angular/core/testing';

import { FofUserbtnService } from './fof-userbtn.service';

describe('FofUserbtnService', () => {
  let service: FofUserbtnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FofUserbtnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
