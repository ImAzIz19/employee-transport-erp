import { TestBed } from '@angular/core/testing';

import { CotisationService } from './cotisation.service';

describe('CotisationService', () => {
  let service: CotisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CotisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
