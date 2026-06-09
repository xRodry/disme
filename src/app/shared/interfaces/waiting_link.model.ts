/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface WaitingLink {
    id: number;
    waited_t: number;
    waited_act: number;
    waiting_t: number;
    waiting_act: number;
    min: number;
    max: number;
    created_by: number;
    updated_by: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
}
