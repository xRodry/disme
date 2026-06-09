/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {TestBed} from '@angular/core/testing';

import {WaitingLinkApiService} from './waiting-link-api.service';

describe('WaitingLinkApiService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: WaitingLinkApiService = TestBed.get(WaitingLinkApiService);
        expect(service).toBeTruthy();
    });
});
