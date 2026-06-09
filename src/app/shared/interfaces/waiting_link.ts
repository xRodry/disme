/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {WaitingLink} from './waiting_link.model';

export class WaitingLinks {
    success: boolean;
    data: WaitingLink[];
    message: string;

    constructor(success: boolean, data: WaitingLink[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
