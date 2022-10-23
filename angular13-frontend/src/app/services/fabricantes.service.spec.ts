import { TestBed } from '@angular/core/testing';

import { FabricantesService } from './fabricantes.service';

describe('FabricantesService', () => {
  let service: FabricantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FabricantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
