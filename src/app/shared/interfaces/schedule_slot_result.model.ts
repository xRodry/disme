/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Term} from './term.model';

export interface ScheduleSlotResult {
    entity_type_id: number;
    scheduled_slot_agenda: number;
    scheduled_slot_number: number;
    scheduled_slot_day: number;
    scheduled_slot_start_time: number;
    scheduled_slot_end_time: number;
    scheduled_slot_additional_properties: ScheduleSlotResultAdditionalProperty[];
}

export interface ScheduleSlotResultAdditionalProperty {
    property_id: number;
    term: Term;
}
