import { TestBed } from '@angular/core/testing';

import { BusPlanificationService } from './bus-planification.service';

describe('BusPlanificationService', () => {
  let service: BusPlanificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusPlanificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
