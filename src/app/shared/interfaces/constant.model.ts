/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface ConstantDB {
  id: number;
  constant_id: number;
  language_id: number;
  value: string;
  value_type: string;
  name: string;
  updated_by: number;
  deleted_by: number;
  // For parsing purposes
  type: string;
  numeric_constants_only: boolean;
  numeric_time_constants_only: boolean;
  numeric_date_time_constants_only: boolean;
  // For when it's inside a compute_expression or a query, where order is important
  order: number;
  propertyIdQueryTerm: number;
}
