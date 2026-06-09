/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Term} from './term.model';

export interface ActionDerivedProp {
    id: number;
    action_id: number;
    property_id: number;
    term_id: number;
    updated_by: number;
    deleted_by: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    // For Blockly XML Parsing
    term?: Term;
}
