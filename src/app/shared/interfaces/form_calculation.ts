/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {FormCalculation} from './form_calculation.model';

// Trigger template transactionType
export class FormCalculations {
  success: boolean;
  data: FormCalculation[];
  message: string;

  constructor(success: boolean, data: FormCalculation[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
