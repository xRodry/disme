/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

export interface RoleInitiatesTransaction {
    role_id: number;
    transaction_type_id: number;
    own_user_access_only: number;
    created_by: number;
    updated_by: number;
    created_at: number;
    updated_at: number;
    deleted_at: number;
}
