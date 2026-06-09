/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface TransactionState {
  id: number;
  t_state_id: number;
  language_id: number;
  name: string;
  abbrv: string;
  updated_by: number;
  deleted_by: number;
}
