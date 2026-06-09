/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface ContextVariable {
    id: number;
    term_id: number;
    text: string;
    value: string | number;
    type: string;
    order: number;
    propertyIdQueryTerm: number;
    blockId?: string;
}
