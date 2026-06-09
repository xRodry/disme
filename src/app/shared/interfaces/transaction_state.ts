/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {TransactionState} from './transaction_state.model';

// Trigger template transactionType
export class TransactionStates {
  success: boolean;
  data: TransactionState[];
  message: string;

  constructor(success: boolean, data: TransactionState[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
