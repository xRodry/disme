/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { AgGridTranslateService } from './ag-grid-translate.service';

describe('AgGridTranslateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgGridTranslateService = TestBed.get(AgGridTranslateService);
    expect(service).toBeTruthy();
  });
});
