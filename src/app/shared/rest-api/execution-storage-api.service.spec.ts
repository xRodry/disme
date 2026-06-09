/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TestBed } from '@angular/core/testing';

import {ExecutionStorageApiService} from './execution-storage-api.service';

describe('ExecutionStorageApiService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ExecutionStorageApiService = TestBed.get(ExecutionStorageApiService);
        expect(service).toBeTruthy();
    });
});
