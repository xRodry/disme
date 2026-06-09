/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { BlocklyApiService } from './blockly-api.service';

describe('BlocklyApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlocklyApiService = TestBed.get(BlocklyApiService);
    expect(service).toBeTruthy();
  });
});
