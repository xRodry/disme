/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { ActionPropFormApiService } from './action-prop-form-api.service';

describe('ActionPropFormApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActionPropFormApiService = TestBed.get(ActionPropFormApiService);
    expect(service).toBeTruthy();
  });
});
