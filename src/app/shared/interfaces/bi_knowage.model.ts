/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {SafeResourceUrl} from '@angular/platform-browser';

export interface BiKnowage {
    id: number;
    label: string;
    preview: SafeResourceUrl | string;
    type: string;
    role: string;
    dataset_label: string;
    display_toolbar: number;
    display_sliders: number;
    reset_parameters: number;
    name: string;
    description: string;
    language_id: number;
    language_abbrv: string;
    created_at: number;
    updated_at: number;
    updated_by: number;
    deleted_by: number;
}
