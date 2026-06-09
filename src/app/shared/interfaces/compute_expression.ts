/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ComputeExpression} from './compute_expression.model';

export class ComputeExpressions {
  success: boolean;
  data: ComputeExpression[];
  message: string;

  constructor(success: boolean, data: ComputeExpression[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
