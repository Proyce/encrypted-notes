import { TestBed } from '@angular/core/testing';

import { SecretKeyService } from './secret-key.service';

describe('SecretKeyService', () => {
  let service: SecretKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecretKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
