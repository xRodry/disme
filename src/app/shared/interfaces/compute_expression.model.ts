/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Term} from './term.model';

export interface ComputeExpression {
  id: number;
  operator: string;
  terms?: Term[];
  updated_by: number;
  deleted_by: number;
  // For when it's inside a queryTerm
  propertyIdQueryTerm: number;
  // For when we're dealing with a compute_expression that has time/date terms
  result_in?: string;
}
