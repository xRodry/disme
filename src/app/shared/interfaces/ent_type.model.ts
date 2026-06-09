/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Property} from './property.model';

export interface EntType {
  ent_type_id: number;
  language_id: number;
  name: string;
  updated_by: number;
  deleted_by: number;
  transaction_type_id: number;
  id: number;
  properties?: any[];
}
