/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { RoleApiService } from './role-api.service';

describe('RoleApiService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: RoleApiService = TestBed.get(RoleApiService);
        expect(service).toBeTruthy();
    });
});
