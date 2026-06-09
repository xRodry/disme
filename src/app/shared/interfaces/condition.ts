/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Condition} from './condition.model';

export class Conditions {
  success: boolean;
  data: Condition[];
  message: string;

  constructor(success: boolean, data: Condition[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
