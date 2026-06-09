/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Action} from './action.model';

// Trigger template transactionType
export class Actions {
  success: boolean;
  data: Action[];
  message: string;

  constructor(success: boolean, data: Action[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
