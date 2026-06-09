/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ProcessDetails} from './processDetails.model';

export class ProcessesDetails {
    success: boolean;
    data: ProcessDetails[];
    message: string;

    constructor(success: boolean, data: ProcessDetails[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
