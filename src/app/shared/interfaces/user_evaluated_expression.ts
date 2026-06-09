/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {UserEvaluatedExpression} from './user_evaluated_expression.model';

// Trigger template transactionType
export class UserEvaluatedExpressions {
  success: boolean;
  data: UserEvaluatedExpression[];
  message: string;

  constructor(success: boolean, data: UserEvaluatedExpression[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
