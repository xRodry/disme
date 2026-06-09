/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { NewDashboardApiService } from './newDashboard-api.service';

describe('InitTDashbApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewDashboardApiService = TestBed.get(NewDashboardApiService);
    expect(service).toBeTruthy();
  });
});
