/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Term} from './term.model';

export interface CompEvaluatedExpression {
  id: number;
  parent_cond_id: number;
  logical_operator: string;
  term_1_id: number;
  term_2_id: number;
  updated_by: number;
  deleted_by: number;
  // For parsing purposes
  term1?: Term;
  term2?: Term;
}
