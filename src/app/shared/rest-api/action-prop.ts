/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { ActionProp } from '../interfaces/action_prop.model';

export class ActionsProp {
  success: boolean;
  data: ActionProp[];
  message: string;

  constructor(success: boolean, data: ActionProp[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
