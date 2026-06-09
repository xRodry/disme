/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface CausalLink {
    id: number;
    causing_action: number;
    caused_transaction_type_id: number;
    caused_t_state_id: number;
    min: string;
    max: string;
    cancel_proc: number;
    continue_if_same_user: number;
    updated_by: number;
    deleted_by: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
}
