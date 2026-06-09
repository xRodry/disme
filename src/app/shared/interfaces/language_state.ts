/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { LanguageState } from './language_state.model';

export class LanguageStates {
  success: boolean;
  data: LanguageState[];
  message: string;

  constructor(success: boolean, data: LanguageState[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
