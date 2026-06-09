/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { AlertToastService } from './alert-toast.service';

describe('AlertToastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertToastService = TestBed.get(AlertToastService);
    expect(service).toBeTruthy();
  });
});
