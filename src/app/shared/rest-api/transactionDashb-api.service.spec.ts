/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { TransactionsDashbApiService } from './transactionDashb-api.service';

describe('LanguageApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionsDashbApiService = TestBed.get(TransactionsDashbApiService);
    expect(service).toBeTruthy();
  });
});
