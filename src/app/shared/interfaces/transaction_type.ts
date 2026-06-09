/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {TransactionType} from './transaction_type.model';

// Trigger template transactionType
export class TransactionTypes {
  success: boolean;
  data: TransactionType[];
  message: string;

  constructor(success: boolean, data: TransactionType[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
