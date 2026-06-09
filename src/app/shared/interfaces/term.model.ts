/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ContextVariable} from './context_variable.model';
import {Property} from './property.model';
import {ConstantDB} from './constant.model';
import {ValueTerm} from './value_term.model';
import {PropertyValue} from './property_value.model';
import {ComputeExpression} from './compute_expression.model';
import {Query} from './query.model';
import {EntityType} from './enttype.model';

export interface Term {
    id: number;
    type: string;
    details: Property | ConstantDB | ValueTerm | PropertyValue | ComputeExpression | Query | ContextVariable | EntityType;
    order?: number;
    queryParameterPropertyId?: number;
    userRoleId?: number;
}
