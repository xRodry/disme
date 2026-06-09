/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Term} from './term.model';

export interface Query {
    query_builder: string;
    id: number;
    query_id: number;
    name: string;
    language_id: number;
    updated_by: number;
    updated_at: Date;
    base_ent_type_id: number;
    queryBuilder: any;
    selectedEntityTypes: SelectedEntityType[];
    includedProperties: {};
    filterProperties: {};
    filters?: {};
    automatedName?: string;
    parameters?: [];
    // For parsing purposes, when we have input terms
    blockly_parameters: QueryParameter[];
    // For when it's inside a compute_expression or a query, where order is important
    order?: number;
    propertyIdQueryTerm?: number;
}

interface SelectedEntityType {
    id: number;
    name: string;
    parEntTypes: any[];
    properties: any[];
    displayProperties: any;
    isBaseTable: boolean;
    checked: boolean;
    disabled: boolean;
}

interface QueryParameter {
    property_id: number;
    term?: Term;
}
