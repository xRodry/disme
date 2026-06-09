/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { TemplateApiService } from './template-api.service';

describe('TemplateApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TemplateApiService = TestBed.get(TemplateApiService);
    expect(service).toBeTruthy();
  });
});
