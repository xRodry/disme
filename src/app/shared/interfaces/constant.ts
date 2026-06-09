/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ConstantDB} from './constant.model';

export class ConstantsDB {
  success: boolean;
  data: ConstantDB[];
  message: string;

  constructor(success: boolean, data: ConstantDB[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
