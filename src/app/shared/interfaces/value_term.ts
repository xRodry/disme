/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ValueTerm} from './value_term.model';

export class ValueTerms {
  success: boolean;
  data: ValueTerm[];
  message: string;

  constructor(success: boolean, data: ValueTerm[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
