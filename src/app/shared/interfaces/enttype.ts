/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {EntityType} from './enttype.model';

export class EntityTypes {
  success: boolean;
  data: EntityType[];
  message: string;

  constructor(success: boolean, data: EntityType[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
