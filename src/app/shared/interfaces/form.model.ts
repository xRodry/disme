/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ActionPropForm} from './action_prop_form.model';
import {EnableConditionLog} from './enable_condition_log.model';
import {FormCalculationLog} from './form_calculation_log.model';

export interface Form {
  id: number;
  form_id: number;
  name: string;
  action_id: number;
  json: string;
  actionPropForms: ActionPropForm[];
  enableConditionLogs?: EnableConditionLog[];
  formCalculationLogs?: FormCalculationLog[];
  // For the form translator component
  actionNameTranslated?: string;
  // For the form rendered component
  updatedActionProps?: any[];
  hasTranslatedActionName?: number;
  // For the form management component
  being_used_in_ar_execution: number;
  needs_updating: boolean;
  deleted_action_rule: string;
}
