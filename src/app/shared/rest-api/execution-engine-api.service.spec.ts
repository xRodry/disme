/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { ExecutionEngineApiService } from './execution-engine-api.service';

describe('ExecutionEngineApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExecutionEngineApiService = TestBed.get(ExecutionEngineApiService);
    expect(service).toBeTruthy();
  });
});
