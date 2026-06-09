/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import { RoleHasUserApiService } from './role-has-user-api.service';

describe('RoleHasUserApiService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: RoleHasUserApiService = TestBed.get(RoleHasUserApiService);
        expect(service).toBeTruthy();
    });
});
