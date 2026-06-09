/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { User } from '../interfaces/user.model';

export class Users {
  success: boolean;
  data: User[];
  message: string;

  constructor(success: boolean, data: User[], message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
