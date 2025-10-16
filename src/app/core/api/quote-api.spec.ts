import { TestBed } from '@angular/core/testing';

import { QuoteApi } from './quote-api';

describe('Quote', () => {
  let service: QuoteApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuoteApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
