/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {TestBed} from '@angular/core/testing';

import {PropUnitTypeApiService} from './prop-unit-type-api.service';

describe('PropUnitTypeApiService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: PropUnitTypeApiService = TestBed.get(PropUnitTypeApiService);
        expect(service).toBeTruthy();
    });
});
