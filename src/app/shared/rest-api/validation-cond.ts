/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { ValidationCond } from '../interfaces/validation_cond.model';

export class ValidationConds {
  success: boolean;
  data: ValidationCond[];
  message: string;

  constructor(success: boolean, data: ValidationCond[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
