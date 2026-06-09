/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { DynSearchApiService } from './dyn-search-api.service';

describe('DynSearchApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynSearchApiService = TestBed.get(DynSearchApiService);
    expect(service).toBeTruthy();
  });
});
