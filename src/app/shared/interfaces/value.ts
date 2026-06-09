/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Value} from './value.model';

// Trigger template transactionType
export class Values {
  success: boolean;
  data: Value[];
  message: string;

  constructor(success: boolean, data: Value[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
