/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { ActionPropForm } from '../interfaces/action_prop_form.model';

export class ActionsPropForm {
  success: boolean;
  data: ActionPropForm[];
  message: string;

  constructor(success: boolean, data: ActionPropForm[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
