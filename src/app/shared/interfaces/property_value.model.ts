/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface PropertyValue {
  p_a_v_id: number;
  property_id: number;
  language_id: number;
  name: string;
  value_type: string;
  fk_property_id: number;
  updated_by: number;
  deleted_by: number;
  id: number;
  // So we know which table it got its value from
  table?: string;
}
