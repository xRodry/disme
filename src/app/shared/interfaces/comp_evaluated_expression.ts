/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {CompEvaluatedExpression} from './comp_evaluated_expression.model';

export class CompEvaluatedExpressions {
  success: boolean;
  data: CompEvaluatedExpression[];
  message: string;

  constructor(success: boolean, data: CompEvaluatedExpression[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
