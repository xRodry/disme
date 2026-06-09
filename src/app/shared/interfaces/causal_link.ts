/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {CausalLink} from './causal_link.model';

export class CausalLinks {
    success: boolean;
    data: CausalLink[];
    message: string;

    constructor(success: boolean, data: CausalLink[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
