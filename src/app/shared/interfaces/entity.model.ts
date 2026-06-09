/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface Entity {
  id: number;
  ent_type_id: number;
  ent_type_name: string;
  state: string;
  transaction_id: number;
  created_by: number;
  updated_by: number;
}
