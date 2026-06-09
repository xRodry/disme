/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Language} from './language.model';

export interface ProcessType {
  count: number;
  state: string;
  name: string;
  language: Language[];
  language_id: string;
  process_type_id: number;
  deleted_by: number;
  updated_by: number;
}
