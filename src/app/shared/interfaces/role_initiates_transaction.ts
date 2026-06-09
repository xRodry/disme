/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {RoleInitiatesTransaction} from './role_initiates_transaction.model';


export class RoleInitiatesTransactions {
    success: boolean;
    data: RoleInitiatesTransaction[];
    message: string;

    constructor(success: boolean, data: RoleInitiatesTransaction[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
