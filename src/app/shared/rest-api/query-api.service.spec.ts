/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { QueryApiService } from './query-api.service';

describe('QueryApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryApiService = TestBed.get(QueryApiService);
    expect(service).toBeTruthy();
  });
});
