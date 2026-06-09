/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface Value {
  value_id: number;
  property_id: number;
  language_id: number;
  name: string;
  value: string;
  state: string;
  updated_by: number;
  deleted_by: number;
  id: number;
}
