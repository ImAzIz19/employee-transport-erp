import { TestBed } from '@angular/core/testing';

import { UploadActionService } from './upload-action.service';

describe('UploadActionService', () => {
  let service: UploadActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
