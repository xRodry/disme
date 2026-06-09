/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface Delegation {
    id: number;
    roles: [];
    delegates_role_id: number;
    delegates_role_name: string;
    delegated_role_id: number;
    delegated_role_name: string;
    user_id: number;
    t_state_id: number;
    t_state_name: string;
    type: string;
    transaction_type_id: number;
    transaction_type_name: string;
    visible_to_delegator: number;
    delegated_user_can_delegate: number;
    start_time: Date;
    end_time: Date;
    updated_by: number;
    deleted_by: number;
}
