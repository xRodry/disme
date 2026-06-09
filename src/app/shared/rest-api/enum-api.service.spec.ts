/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import {EnumApiService} from './enum-api.service';

describe('EnumApiService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: EnumApiService = TestBed.get(EnumApiService);
        expect(service).toBeTruthy();
    });
});
