/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface ScheduleSlotOrigin {
    entity_type_id: number;
    scheduling_user: number;
    scheduling_start_date: number;
    scheduling_start_time: number;
    scheduling_end_date: number;
    scheduling_end_time: number;
    scheduling_weekdays: number;
    scheduling_duration: number;
    scheduling_slots_count: number;
}
