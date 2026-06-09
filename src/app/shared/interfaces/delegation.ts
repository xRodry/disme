/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {Delegation} from './delegation.model';

export class Delegations {
    success: boolean;
    data: Delegation[];
    message: string;

    constructor(success: boolean, data: Delegation[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
