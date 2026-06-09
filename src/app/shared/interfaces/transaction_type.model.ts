/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface TransactionType {
  id: number;
  transaction_type_id: number;
  state: string;
  process_type_id: number;
  init_proc: number;
  end_proc: number;
  interm_task: number;
  external: number;
  type: string;
  frontier: number;
  frontier_type: string;
  executer_role_id: number;
  own_user_access_only: number;
  auto_activate: number;
  freq_activate: string;
  when_activate: string;
  language_id: number;
  language_abbrv: string;
  t_name: string;
  rt_name: string;
  created_by: number;
  updated_by: number;
  restriction_query_id?: number;
}
