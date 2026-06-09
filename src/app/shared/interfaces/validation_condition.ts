/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ValidationCondition} from './validation_condition.model';

export class ValidationConditions {
  success: boolean;
  data: ValidationCondition[];
  message: string;

  constructor(success: boolean, data: ValidationCondition[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
