/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {EntType} from './ent_type.model';

// Trigger template transactionType
export class EntTypes {
  success: boolean;
  data: EntType[];
  message: string;

  constructor(success: boolean, data: EntType[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
