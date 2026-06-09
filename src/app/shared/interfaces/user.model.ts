/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface User {
  id: number;
  name: string;
  nif: number;
  password: string;
  email: string;
  user_name: string;
  language_id: number;
  user_type: string;
  entity_id: number;
  ent_type_id: number;
  user_details: [];
  created_at: string;
  updated_at: string;
  delete_at: string;
}
