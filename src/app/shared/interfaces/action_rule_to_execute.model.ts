/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface ActionRuleToExecute {
    transaction_type_id: number;
    t_state_id: number;
    transaction_id: number;
    last_action_id: number;
    process_id: number;
    transaction_state_id: number;
    ack_on: boolean;
    process_type_id: number;
    action_rule_type: string;
    originating_tasks: [];
    user_detailing_process_type: number;
    user_detailing_ent_type_id: number;
    user_detailing_user_id: number;
}
