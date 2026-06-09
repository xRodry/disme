/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface ActionLog {
  id: number;
  state: string;
  action_id: number;
  transaction_state_id: number;
  updated_by: number;
  deleted_by: number;
}
