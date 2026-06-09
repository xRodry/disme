/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ActionRule} from './action_rule.model';

// Trigger template transactionType
export class ActionRules {
  success: boolean;
  data: ActionRule[];
  message: string;

  constructor(success: boolean, data: ActionRule[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
