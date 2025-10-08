import { TestBed } from '@angular/core/testing';

import { OfrendaService } from './ofrenda.service';

describe('OfrendaService', () => {
  let service: OfrendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfrendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
