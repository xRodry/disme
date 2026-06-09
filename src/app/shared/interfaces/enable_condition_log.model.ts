/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface EnableConditionLog {
    id: number;
    enable_condition_id: number;
    form_id: number;
    json_logic: string;
    action_prop_id?: number;
}
