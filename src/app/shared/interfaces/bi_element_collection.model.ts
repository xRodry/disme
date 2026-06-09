/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {SafeResourceUrl} from '@angular/platform-browser';

export interface BiElementCollection {
    user_id: number;
    bi_element_id: number;
    preview: SafeResourceUrl | string;
    embed: SafeResourceUrl | string;
    name: string;
    description: string;
    language_id: number;
    language_abbrv: string;
    updated_at: string;
    created_at: string;
    updated_by: number;
    deleted_by: number;
}
