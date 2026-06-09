/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface ValidationCond {
  id: number;
  type: string;
  action_prop_id: number;
  action_template_id: number;
  param_1: string;
  param_2: string;
  custom_validation: string;
  negative: boolean;
}
