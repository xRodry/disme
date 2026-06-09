/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {QueryParameter} from './query_parameter.model';

export class QueryParameters {
  success: boolean;
  data: QueryParameter[];
  message: string;

  constructor(success: boolean, data: QueryParameter[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
