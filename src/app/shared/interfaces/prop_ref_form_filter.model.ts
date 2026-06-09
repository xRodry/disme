/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Term} from './term.model';

export interface PropRefFormFilter {
    id: number;
    action_prop_id: number;
    referenced_property_id: number;
    operator: string;
    term_id: string;
    updated_by: number;
    deleted_by: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    // For DB parsing
    term?: Term;
}
