/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { TransactionDashb } from './transaction_dashb.model';

export class TransactionsDashb {
  success: boolean;
  data: TransactionDashb[];
  message: string;

  constructor(success: boolean, data: TransactionDashb[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
