/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {TestBed} from '@angular/core/testing';

import {ProcessTypeApiService} from './processtype-api.service';

describe('ProcessTypeApiService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ProcessTypeApiService = TestBed.get(ProcessTypeApiService);
        expect(service).toBeTruthy();
    });
});
