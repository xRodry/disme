/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ProcessType} from './processtype.model';

export class ProcessTypes {
    success: boolean;
    data: ProcessType[];
    message: string;

    constructor(success: boolean, data: ProcessType[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
