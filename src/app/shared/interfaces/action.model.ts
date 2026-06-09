/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Property} from './property.model';
import {Template} from './template.model';
import {Condition} from './condition.model';
import {ActionDerivedProp} from './action_derived_prop.model';
import {ScheduleSlotResult} from './schedule_slot_result.model';
import {ScheduleSlotOrigin} from './schedule_slot_origin.model';
import {Term} from './term.model';

export interface Action {
    id: number;
    action_rule_id: number;
    type: string;
    prev_action_id: number;
    next_action_id: number;
    name: string;
    comment: string;
    par_action_id: number;
    updated_by: number;
    deleted_by: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
    // In case it is causal_link
    caused_action_trans_type_id?: number;
    caused_action_t_state_id?: number;
    min?: number;
    max?: number;
    cancel_process?: number;
    continue_if_same_user?: number;
    // In case is user_output
    template?: Template;
    // In case it is user_input
    properties?: Property[];
    derivedProperties?: ActionDerivedProp[];
    // In case it is edit_entity_instance
    entity_details: Property[];
    entityFilterTerm: Term;
    // In case it is assign_expression
    destinationTerm?: Term;
    sourceTerm?: Term;
    // In case is if_then
    ifCondition: Condition;
    thenAction: Action[];
    elseAction?: Action[];
    // In case is WHILE DO
    whileCondition: Condition;
    doAction: Action[];
    // In case it's a 'create schedule slots' action
    scheduleSlotOrigin: ScheduleSlotOrigin;
    scheduleSlotResult: ScheduleSlotResult;
}
