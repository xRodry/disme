/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {TestBed} from '@angular/core/testing';

import {ProcessDetailsApiService} from './processDetails-api.service';

describe('ProcessDetailsApiService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ProcessDetailsApiService = TestBed.get(ProcessDetailsApiService);
        expect(service).toBeTruthy();
    });
});
