/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Term} from './term.model';

export interface FormCalculation {
    id: number;
    action_prop_id: number;
    operator: string;
    terms: Term[];
    updated_by: number;
    deleted_by: number;
}
