/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Process} from './process.model';

export class Processes {
  success: boolean;
  data: Process[];
  message: string;

  constructor(success: boolean, data: Process[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
