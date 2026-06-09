/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import {ProcessTypeState} from './processtypestate.model';


export class ProcessTypeStates {
    success: boolean;
    data: ProcessTypeState[];
    message: string;

    constructor(success: boolean, data: ProcessTypeState[], message: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
