/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {TestBed} from '@angular/core/testing';

import {TransactionStateApiService} from './transaction-state-api.service';

describe('TransactionStateApiService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: TransactionStateApiService = TestBed.get(TransactionStateApiService);
        expect(service).toBeTruthy();
    });
});
