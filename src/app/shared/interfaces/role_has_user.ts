/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {RoleHasUser} from './role_has_user.model';

export class RoleHasUsers {
    success: boolean;
    data: RoleHasUser[];
    message: string;

    constructor(success: boolean, data: RoleHasUser[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
