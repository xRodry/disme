/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { DelegationsApiService } from './delegations-api.service';

describe('DelegationsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DelegationsApiService = TestBed.get(DelegationsApiService);
        expect(service).toBeTruthy();
    });
});
