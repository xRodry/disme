/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Entity} from './entity.model';

export class Entities {
  success: boolean;
  data: Entity[];
  message: string;

  constructor(success: boolean, data: Entity[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
