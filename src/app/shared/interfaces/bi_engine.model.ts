/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {BiElement} from './bi_element.model';
import {SafeResourceUrl} from '@angular/platform-browser';

export interface BiEngine {
    id: number;
    name: string;
    logo_preview: SafeResourceUrl | string;
    biElements: BiElement[];
    created_at: number;
    updated_at: number;
    updated_by: number;
    deleted_by: number;
}
