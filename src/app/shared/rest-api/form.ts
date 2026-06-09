/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Form } from '../interfaces/form.model';

export class Forms {
  success: boolean;
  data: Form[];
  message: string;

  constructor(success: boolean, data: Form[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
