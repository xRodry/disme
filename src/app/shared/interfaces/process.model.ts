/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface Process {
  id: number;
  internal_id: number;
  process_type_id: number;
  proc_state: string;
  state: string;
  updated_by: number;
  deleted_by: number;
  created_at: number;
  updated_at: number;
  deleted_at: number;
}
