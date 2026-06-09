/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { ActionPropApiService } from './action-prop-api.service';

describe('ActionPropApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActionPropApiService = TestBed.get(ActionPropApiService);
    expect(service).toBeTruthy();
  });
});
