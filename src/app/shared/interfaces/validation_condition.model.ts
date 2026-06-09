/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Template} from './template.model';

export interface ValidationCondition {
  id: number;
  type: string;
  action_prop_id: number;
  param_1: string;
  param_2: any;
  custom_validation: string;
  negative: number;
  updated_by: number;
  deleted_by: number;
  // For parsing purposes
  template: Template;
  valueType: string;
  multipleValues: boolean;
}
