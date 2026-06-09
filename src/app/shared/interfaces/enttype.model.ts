/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Term} from './term.model';
import {Property} from './property.model';

export interface EntityType {
  id: number;
  name: string;
  id_name: string;
  language_id: number;
  language_abbrv: string;
  state: string;
  transaction_type_id: number;
  transaction_type_name: string;
  last_internal_id: number;
  has_many: number;
  auto_generated: number;
  external: number;
  user_details: number;
  created_by: number;
  updated_by: number;
  // For DB parsing
  optionsFromQueryTerm?: Term;
  mandatory?: number;
  entityDetails?: Property[];
}
