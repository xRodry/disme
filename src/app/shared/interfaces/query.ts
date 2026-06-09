/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Query} from './query.model';

export class Queries {
  success: boolean;
  data: Query[];
  message: string;

  constructor(success: boolean, data: Query[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
