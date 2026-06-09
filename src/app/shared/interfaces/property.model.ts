/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {FormCalculation} from './form_calculation.model';
import {Condition} from './condition.model';
import {ValidationCondition} from './validation_condition.model';
import {Query} from './query.model';
import {PropRefFormFilter} from './prop_ref_form_filter.model';
import {Term} from "./term.model";

export interface Property {
  id: number;
  property_id: number;
  language_id: number;
  name: string;
  state: string;
  ent_type_id: number;
  scope: string;
  value_type: string;
  fk_property_id: number;
  fk_property?: Property;
  fk_entity_type_id: number;
  part_of: number;
  requires_translation: number;
  editable: number;
  soft_delete: number;
  is_a: number;
  is_dependent: number;
  multiple_values: number;
  updated_by: number;
  deleted_by: number;
  created_at: number;
  updated_at: number;
  deleted_at: number;
  // For DB parsing
  form_calculation?: FormCalculation;
  enable_condition?: Condition;
  validation_conditions?: ValidationCondition[];
  propertyFilters?: PropRefFormFilter[];
  optionsFromQueryTerm?: Term;
  mandatory?: number;
  cant_change_value_type_fk_ent_type?: boolean;
  specificEntityTerm?: Term;
  // For when it's inside a compute_expression or a query, where order is important
  order: number;
  propertyIdQueryTerm: number;
  property_values: [];
  fk_entity_type_properties: FkEntTypeProperty[];
}

export interface FkEntTypeProperty {
    id: string;
    name: string;
}
