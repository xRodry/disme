/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Role} from './role.model';


export class Roles {
    success: boolean;
    data: Role[];
    message: string;

    constructor(success: boolean, data: Role[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
