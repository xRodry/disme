/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { BiManagementApiService } from './bi-management-api.service';

describe('biManagementApiService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: BiManagementApiService = TestBed.get(BiManagementApiService);
        expect(service).toBeTruthy();
    });
});
