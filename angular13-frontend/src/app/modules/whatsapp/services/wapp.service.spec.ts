import { TestBed } from '@angular/core/testing';

import { WappService } from './wapp.service';

describe('WappService', () => {
  let service: WappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
