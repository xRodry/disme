/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Language } from './language.model';

export class Languages {
  success: boolean;
  data: Language[];
  message: string;

  constructor(success: boolean, data: Language[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
