/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Property} from './property.model';

// Trigger template transactionType
export class Properties {
  success: boolean;
  data: Property[];
  message: string;

  constructor(success: boolean, data: Property[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
